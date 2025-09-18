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
    const { team1, team2, context, question } = JSON.parse(event.body || "{}");

    const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
    const MODEL = "mistral-large-latest";

    if (!MISTRAL_API_KEY) {
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Mistral API key not configured" }),
      };
    }

    // Create reasoning prompt for MLB analysis
    const prompt = `You are an advanced MLB reasoning agent with access to comprehensive sports data. Analyze the following information and provide intelligent insights:

TEAM 1: ${team1}
TEAM 2: ${team2}
CONTEXT: ${context || "General analysis requested"}
QUESTION: ${question || "Provide comprehensive analysis"}

Please provide:
1. **Strategic Analysis**: Key strengths and weaknesses
2. **Statistical Insights**: Important metrics and trends
3. **Betting Intelligence**: Risk assessment and recommendations
4. **Reasoning Process**: Explain your analytical approach
5. **Confidence Level**: Rate your analysis confidence (1-10)

Format your response as structured analysis with clear sections.`;

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
            content: "You are an expert MLB analyst with advanced reasoning capabilities. Provide detailed, data-driven insights with clear explanations."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Mistral API error: ${response.statusText}`);
    }

    const data = await response.json();
    const analysis = data.choices[0]?.message?.content || "No analysis generated";

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        analysis,
        model: MODEL,
        timestamp: new Date().toISOString(),
        reasoning_type: "advanced_mlb_analysis"
      }),
    };
  } catch (error) {
    console.error("Mistral reasoning error:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Reasoning analysis failed" }),
    };
  }
}
