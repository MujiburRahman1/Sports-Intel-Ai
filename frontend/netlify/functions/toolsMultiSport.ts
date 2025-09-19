// Inline proxy function to avoid import issues
interface NetlifyEvent {
  httpMethod: string;
  headers?: Record<string, string | undefined>;
  queryStringParameters?: Record<string, string | undefined>;
  body?: string | null;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-tool-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Cache-Control": "no-store",
} as const;

function handleOptions(event: NetlifyEvent) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders, body: "" };
  }
  return null;
}

async function proxyTool(event: NetlifyEvent, operation: string) {
  const maybeOptions = handleOptions(event);
  if (maybeOptions) return maybeOptions;

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL || "http://127.0.0.1:8001";
  const upstream = `${BACKEND_BASE_URL.replace(/\/$/, "")}/tools/${operation}`;

  try {
    const raw = event.body || "{}";
    const json = JSON.parse(raw);

    const headerToken = event.headers?.["x-tool-token"] || event.headers?.["X-Tool-Token"];
    const toolToken = json.tool_token || headerToken || process.env.TOOL_TOKEN;

    const resp = await fetch(upstream, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(toolToken ? { "x-tool-token": toolToken } : {}),
      },
      body: JSON.stringify(json),
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

export async function handler(event: NetlifyEvent) {
  return proxyTool(event, "multi-sport");
}
