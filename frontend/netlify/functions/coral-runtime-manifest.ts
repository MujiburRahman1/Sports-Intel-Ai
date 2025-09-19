import { handleOptions, NetlifyEvent } from "./_lib/toolsProxy";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-tool-token",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Cache-Control": "no-store",
} as const;

function getBaseUrl(event: NetlifyEvent) {
  const headers = event.headers || {};
  const forwardedProto = (headers["x-forwarded-proto"] || headers["X-Forwarded-Proto"]) as string | undefined;
  const forwardedHost = (headers["x-forwarded-host"] || headers["X-Forwarded-Host"]) as string | undefined;
  const host = (forwardedHost || (headers["host"] as string | undefined) || "").toString();
  const proto = (forwardedProto || (host && host.includes("localhost") ? "http" : "https")) as string;
  return host ? `${proto}://${host}` : "";
}

export async function handler(event: NetlifyEvent) {
  const maybeOptions = handleOptions(event);
  if (maybeOptions) return maybeOptions;

  if (event.httpMethod !== "GET" && event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const base = getBaseUrl(event);
  const fn = (name: string) => (base ? `${base}/.netlify/functions/${name}` : `/.netlify/functions/${name}`);

  try {
    // Get user_id from query parameters or body
    let user_id: string;
    
    if (event.httpMethod === "GET") {
      user_id = event.queryStringParameters?.user_id || "";
    } else {
      const body = JSON.parse(event.body || "{}");
      user_id = body.user_id || "";
    }

    if (!user_id) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "user_id parameter is required" }),
      };
    }

    // Fetch user profile and generate runtime manifest
    const response = await fetch(`${base || "http://localhost:8001"}/tools/user-profile/${user_id}`);
    
    if (!response.ok) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ error: "User profile not found" }),
      };
    }

    const userProfile = await response.json();
    
    // Generate runtime manifest for the user
    const runtimeManifest = {
      name: `Personalized ${userProfile.favorite_team} Agent Runtime`,
      description: `Runtime manifest for ${userProfile.favorite_team} fan - ${userProfile.user_id}`,
      version: "1.0.0",
      user_specific: true,
      user_id: userProfile.user_id,
      favorite_team: userProfile.favorite_team,
      sport: userProfile.sport,
      generated_at: new Date().toISOString(),
      agents: [
        {
          id: `personalized-${userProfile.favorite_team.toLowerCase().replace(/\s+/g, '-')}-agent`,
          name: `${userProfile.favorite_team} Personal Agent`,
          description: `Your personal ${userProfile.favorite_team} assistant`,
          user_id: userProfile.user_id,
          favorite_team: userProfile.favorite_team,
          sport: userProfile.sport.toUpperCase(),
          methods: [
            {
              name: "analyze_team",
              http: { method: "POST", url: fn("toolsPersonalizedAgent") },
              input_schema: {
                type: "object",
                properties: {
                  analysis_type: { type: "string", enum: ["game", "season", "player", "comparison"] },
                  context: { type: "string", description: "Specific context for analysis" },
                  user_id: { type: "string", default: userProfile.user_id },
                  favorite_team: { type: "string", default: userProfile.favorite_team }
                },
                required: ["analysis_type"],
              },
            },
            {
              name: "get_insights",
              http: { method: "POST", url: fn("toolsPersonalizedAgent") },
              input_schema: {
                type: "object",
                properties: {
                  insight_type: { type: "string", enum: ["stats", "news", "predictions", "recommendations"] },
                  timeframe: { type: "string", enum: ["today", "week", "month", "season"] },
                  user_id: { type: "string", default: userProfile.user_id },
                  favorite_team: { type: "string", default: userProfile.favorite_team }
                },
                required: ["insight_type"],
              },
            },
            {
              name: "update_preferences",
              http: { method: "POST", url: fn("toolsPersonalizedAgent") },
              input_schema: {
                type: "object",
                properties: {
                  preferences: { type: "object", description: "Updated user preferences" },
                  user_id: { type: "string", default: userProfile.user_id }
                },
                required: ["preferences"],
              },
            }
          ],
          custom_config: {
            greeting: `Hello! I'm your personal ${userProfile.favorite_team} assistant. How can I help you today?`,
            preferences: userProfile.preferences,
            specializations: [
              `${userProfile.favorite_team} game analysis`,
              `${userProfile.favorite_team} player statistics`,
              `${userProfile.favorite_team} schedule tracking`,
              `${userProfile.favorite_team} news aggregation`
            ]
          }
        }
      ],
      capabilities: [
        "Real-time game analysis",
        "Player performance tracking",
        "Trade rumor analysis",
        "Schedule optimization",
        "Fan sentiment monitoring"
      ],
      data_sources: [
        `${userProfile.favorite_team} official statistics`,
        `${userProfile.sport} league data`,
        `${userProfile.favorite_team} social media`,
        `${userProfile.favorite_team} news sources`
      ],
      created_at: userProfile.created_at,
      last_updated: userProfile.last_updated
    };

    return {
      statusCode: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify(runtimeManifest, null, 2),
    };

  } catch (error) {
    console.error("Runtime manifest generation error:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Failed to generate runtime manifest" }),
    };
  }
}
