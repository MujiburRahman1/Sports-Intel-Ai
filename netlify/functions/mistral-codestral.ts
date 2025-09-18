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
    const { type, language, requirements, context } = JSON.parse(event.body || "{}");

    const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
    const MODEL = "codestral-latest";

    if (!MISTRAL_API_KEY) {
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Mistral API key not configured" }),
      };
    }

    // Create code generation prompt based on type
    let prompt = "";
    
    switch (type) {
      case "sports_analytics":
        prompt = `Generate ${language} code for sports analytics with the following requirements:
- ${requirements}
- Context: ${context || "MLB data analysis"}
- Include data processing, visualization, and statistical analysis
- Add proper error handling and documentation
- Use modern best practices`;
        break;
        
      case "nft_metadata":
        prompt = `Generate ${language} code for NFT metadata generation:
- ${requirements}
- Context: ${context || "Sports-themed NFT collection"}
- Include metadata structure, image generation, and blockchain integration
- Add validation and error handling
- Use JSON-LD format for metadata`;
        break;
        
      case "betting_calculator":
        prompt = `Generate ${language} code for betting calculator:
- ${requirements}
- Context: ${context || "MLB betting odds analysis"}
- Include probability calculations, risk assessment, and payout formulas
- Add input validation and security measures
- Include unit testing examples`;
        break;
        
      default:
        prompt = `Generate ${language} code based on requirements:
- ${requirements}
- Context: ${context || "General application"}
- Include proper structure, error handling, and documentation`;
    }

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
            content: "You are Codestral, an expert code generation model. Generate clean, efficient, and well-documented code following best practices."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Mistral API error: ${response.statusText}`);
    }

    const data = await response.json();
    const generatedCode = data.choices[0]?.message?.content || "No code generated";

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        code: generatedCode,
        type,
        language,
        model: MODEL,
        timestamp: new Date().toISOString(),
        generation_type: "codestral_code_generation"
      }),
    };
  } catch (error) {
    console.error("Mistral Codestral error:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Code generation failed" }),
    };
  }
}
