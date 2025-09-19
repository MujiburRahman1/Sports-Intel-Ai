import { NetlifyEvent } from "./_lib/toolsProxy";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-tool-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Cache-Control": "no-store",
} as const;

function optionsResponse() {
  return { statusCode: 200, headers: corsHeaders, body: "" };
}

function getBaseUrl(event: NetlifyEvent) {
  const headers = event.headers || {};
  const forwardedProto = (headers["x-forwarded-proto"] || headers["X-Forwarded-Proto"]) as string | undefined;
  const forwardedHost = (headers["x-forwarded-host"] || headers["X-Forwarded-Host"]) as string | undefined;
  const host = (forwardedHost || (headers["host"] as string | undefined) || "").toString();
  const proto = (forwardedProto || (host && host.includes("localhost") ? "http" : "https")) as string;
  return host ? `${proto}://${host}` : "";
}

export async function handler(event: NetlifyEvent) {
  if (event.httpMethod === "OPTIONS") return optionsResponse();

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const raw = event.body || "{}";
    const call = JSON.parse(raw) as {
      agent?: string;
      method?: string;
      params?: Record<string, unknown>;
    };

    const { agent = "", method = "invoke", params = {} } = call;

    // Map public agent ids to backend tool operation names
    const operationMap: Record<string, string> = {
      "news-brief": "news",
      "sports-compare-stats": "compare_stats",
      "sports-check-schedule": "check_schedule",
      "team-intelligence": "team_intelligence",
      "youtube-scout": "youtube",
      // voice-tts is deprecated in backend; keep for completeness if added later
      "aggregate": "aggregate",
      "wallet-manager": "crossmint-wallet",
      "payment-processor": "crossmint-payment",
      "mistral-reasoning": "mistral-reasoning",
      "mistral-codestral": "mistral-codestral",
      "mistral-multilingual": "mistral-multilingual",
      "mistral-nft-metadata": "mistral-nft-metadata",
      "multi-sport": "multi-sport",
      "personalized-agent": "personalized-agent",
      "gamification-agent": "gamification-agent",
      "nba-stats": "nba",
      "nfl-stats": "nfl",
      "pipeline": "pipeline",
      "sentiment-agent": "sentiment",
      "predict-agent": "predict",
      "visual-analytics-agent": "visual-analytics",
    };

    const target = operationMap[agent];
    if (!target || method !== "invoke") {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Unknown agent or method", agent, method }),
      };
    }

    // Handle Crossmint and Mistral agents differently - they're Netlify functions, not backend calls
    if (agent === "wallet-manager" || agent === "payment-processor" || 
        agent === "mistral-reasoning" || agent === "mistral-codestral" || 
        agent === "mistral-multilingual" || agent === "mistral-nft-metadata" ||
        agent === "multi-sport") {
      const fnUrl = `${getBaseUrl(event)}/.netlify/functions/${target}`;
      const resp = await fetch(fnUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(event.headers?.["x-tool-token"] ? { "x-tool-token": event.headers["x-tool-token"] as string } : {}),
        },
        body: JSON.stringify(params),
      });
      
      const contentType = resp.headers.get("content-type") || "application/json";
      const body = await resp.text();
      
      return {
        statusCode: resp.status,
        headers: { ...corsHeaders, "Content-Type": contentType },
        body,
      };
    }

    // Call backend directly to avoid nested function HTTP in local/dev
    const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL || "http://127.0.0.1:8001";
    const url = `${BACKEND_BASE_URL.replace(/\/$/, "")}/tools/${target}`;

    const toolToken = (event.headers?.["x-tool-token"] as string | undefined) || process.env.TOOL_TOKEN;

    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(toolToken ? { "x-tool-token": toolToken } : {}),
      },
      body: JSON.stringify(params || {}),
    });

    const text = await resp.text();
    const contentType = resp.headers.get("content-type") || "application/json";

    return {
      statusCode: resp.status,
      headers: { ...corsHeaders, "Content-Type": contentType },
      body: text,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : typeof err === "string" ? err : JSON.stringify(err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: message }),
    };
  }
}


