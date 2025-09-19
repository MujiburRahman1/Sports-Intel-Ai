// Netlify Function: Get ElevenLabs signed WebSocket URL for Conversational AI
// Docs: https://elevenlabs.io/docs/conversational-ai/api-reference/conversations/get-signed-url
// Requires env ELEVEN_API_KEY (or ELEVENLABS_API_KEY) and ELEVEN_AGENT_ID (or AGENT_ID)

interface NetlifyEvent {
  httpMethod: string;
  headers?: Record<string, string | undefined>;
  queryStringParameters?: Record<string, string | undefined>;
  body?: string | null;
}

export async function handler(event: NetlifyEvent) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Cache-Control": "no-store",
  } as const;

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders, body: "" };
  }
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const ELEVEN_API_KEY = process.env.ELEVEN_API_KEY || process.env.ELEVENLABS_API_KEY;
  const agentFromEnv = process.env.ELEVEN_AGENT_ID || process.env.AGENT_ID;
  const qp = event.queryStringParameters || {};
  const agentFromQuery = qp.agent_id || qp.agentId;
  const agentId = agentFromQuery || agentFromEnv;

  if (!ELEVEN_API_KEY) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "ELEVEN_API_KEY not configured in environment" }),
    };
  }
  if (!agentId) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Missing ELEVEN_AGENT_ID (or pass ?agent_id=)" }),
    };
  }

  try {
    const upstream = `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${encodeURIComponent(
      agentId,
    )}`;

    const resp = await fetch(upstream, {
      method: "GET",
      headers: {
        // Do NOT expose this key to the client
        "xi-api-key": ELEVEN_API_KEY,
      },
    });

    if (!resp.ok) {
      const text = await resp.text();
      return {
        statusCode: 502,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Upstream error", detail: text }),
      };
    }

    const data: unknown = await resp.json();
    const signedUrl = (data as { signed_url?: unknown; signedUrl?: unknown }).signed_url ?? (data as any)?.signedUrl;

    if (typeof signedUrl !== "string") {
      return {
        statusCode: 502,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Invalid upstream response: missing signed_url" }),
      };
    }

    return {
      statusCode: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ signedUrl }),
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
