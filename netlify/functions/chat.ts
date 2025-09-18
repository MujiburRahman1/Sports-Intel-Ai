// Netlify Function: (Deprecated) Legacy chatbot endpoint
// This endpoint has been deprecated in favor of the ElevenLabs real-time voice agent.
// Please use the /voice page instead of calling this function.

export async function handler(event: any) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  } as const;

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders, body: "" };
  }
  // All non-OPTIONS requests now return 410 Gone with guidance
  return {
    statusCode: 410,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({
      error: "Deprecated",
      message: "This chatbot endpoint is deprecated. Please use the real-time voice agent at /voice.",
      redirect: "/voice",
    }),
  };
}
