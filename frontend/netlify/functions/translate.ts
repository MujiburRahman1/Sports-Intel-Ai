// Netlify Function: Translate text to a target language using OpenAI
// Env: OPENAI_API_KEY

import OpenAI from "openai";

interface NetlifyEvent {
  httpMethod: string;
  headers?: Record<string, string | undefined>;
  body?: string | null;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Cache-Control": "no-store",
} as const;

export async function handler(event: NetlifyEvent) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders, body: "" };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: "Missing OPENAI_API_KEY" }) };
  }

  try {
    const { text, target_lang } = JSON.parse(event.body || "{}") as { text?: string; target_lang?: string };
    if (!text || !target_lang) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Provide 'text' and 'target_lang'" }),
      };
    }

    const client = new OpenAI({ apiKey });
    const system = `You are a professional translator. Translate the user's text into ${target_lang}. Preserve meaning and names. Return only the translated text.`;
    const model = process.env.TRANSLATE_MODEL || "gpt-5"; // default to GPT-5 if available
    const resp = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: text },
      ],
      temperature: 0.2,
    });
    const translated = resp.choices?.[0]?.message?.content || "";

    return {
      statusCode: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ translated }),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : typeof err === "string" ? err : JSON.stringify(err);
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: message }) };
  }
}


