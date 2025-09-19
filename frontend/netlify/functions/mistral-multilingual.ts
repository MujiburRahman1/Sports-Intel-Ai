import { NetlifyEvent } from "../_lib/types";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, x-tool-token",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

export async function handler(event: NetlifyEvent) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { text, target_language, context, voice_mode } = JSON.parse(event.body || "{}");

    const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
    const MODEL = "mistral-large-latest";

    if (!MISTRAL_API_KEY) {
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Mistral API key not configured" }),
      };
    }

    // Create multilingual prompt
    const prompt = `You are a multilingual sports analyst assistant. ${voice_mode ? "This will be spoken aloud, so use natural conversational tone." : ""}

CONTEXT: ${context || "MLB sports analysis"}
TARGET LANGUAGE: ${target_language || "English"}
ORIGINAL TEXT: ${text}

Please:
1. Translate the text to ${target_language}
2. Adapt it for sports context if needed
3. ${voice_mode ? "Make it conversational and engaging for voice output" : "Keep it professional and informative"}
4. Maintain accuracy of sports terminology
5. Add cultural context if relevant

Format: Provide the translation with brief explanation of any cultural adaptations.`;

    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content: "You are a multilingual sports analyst with expertise in cultural adaptation and natural language processing. Provide accurate translations with appropriate cultural context."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      throw new Error(`Mistral API error: ${response.statusText}`);
    }

    const data = await response.json();
    const translation = data.choices[0]?.message?.content || "Translation failed";

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        translation,
        original_text: text,
        target_language,
        voice_mode,
        model: MODEL,
        timestamp: new Date().toISOString(),
        translation_type: "multilingual_sports_analysis"
      }),
    };
  } catch (error) {
    console.error("Mistral multilingual error:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Translation failed" }),
    };
  }
}
