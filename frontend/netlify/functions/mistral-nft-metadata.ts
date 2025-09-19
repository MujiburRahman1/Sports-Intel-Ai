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
    const { player_name, team, achievement, rarity, language } = JSON.parse(event.body || "{}");

    const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
    const MODEL = "mistral-large-latest";

    if (!MISTRAL_API_KEY) {
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Mistral API key not configured" }),
      };
    }

    // Create NFT metadata generation prompt
    const prompt = `Generate comprehensive NFT metadata for a sports achievement badge:

PLAYER: ${player_name}
TEAM: ${team}
ACHIEVEMENT: ${achievement}
RARITY: ${rarity || "Common"}
LANGUAGE: ${language || "English"}

Create:
1. **Name**: Creative badge name
2. **Description**: Detailed achievement description (2-3 sentences)
3. **Attributes**: Array of traits (position, team, season, achievement type, rarity)
4. **Story**: Background story of the achievement
5. **Image Prompt**: Detailed prompt for AI image generation
6. **Tags**: Relevant keywords for discovery

Format as JSON-LD metadata following OpenSea standards. Make it engaging and collectible.`;

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
            content: "You are an expert NFT metadata creator specializing in sports collectibles. Create engaging, accurate, and valuable metadata that enhances the collectible experience."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Mistral API error: ${response.statusText}`);
    }

    const data = await response.json();
    const metadata = data.choices[0]?.message?.content || "Metadata generation failed";

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        metadata,
        player_name,
        team,
        achievement,
        rarity,
        language,
        model: MODEL,
        timestamp: new Date().toISOString(),
        metadata_type: "sports_achievement_nft"
      }),
    };
  } catch (error) {
    console.error("Mistral NFT metadata error:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Metadata generation failed" }),
    };
  }
}
