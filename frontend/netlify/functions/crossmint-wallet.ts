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
    const { action, userId, amount, currency = "USDC" } = JSON.parse(event.body || "{}");

    const CROSSMINT_PROJECT_ID = process.env.CROSSMINT_PROJECT_ID;
    const CROSSMINT_CLIENT_SECRET = process.env.CROSSMINT_CLIENT_SECRET;
    const CROSSMINT_ENVIRONMENT = process.env.CROSSMINT_ENVIRONMENT || "staging";

    if (!CROSSMINT_PROJECT_ID || !CROSSMINT_CLIENT_SECRET) {
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Crossmint configuration missing" }),
      };
    }

    let result;

    switch (action) {
      case "create_wallet":
        result = await createWallet(userId, CROSSMINT_PROJECT_ID, CROSSMINT_CLIENT_SECRET, CROSSMINT_ENVIRONMENT);
        break;
      
      case "get_balance":
        result = await getBalance(userId, CROSSMINT_PROJECT_ID, CROSSMINT_CLIENT_SECRET, CROSSMINT_ENVIRONMENT);
        break;
      
      case "send_payment":
        result = await sendPayment(userId, amount, currency, CROSSMINT_PROJECT_ID, CROSSMINT_CLIENT_SECRET, CROSSMINT_ENVIRONMENT);
        break;
      
      default:
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: "Invalid action" }),
        };
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error("Crossmint wallet error:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
}

async function createWallet(userId: string, projectId: string, clientSecret: string, environment: string) {
  const baseUrl = environment === "production" ? "https://api.crossmint.com" : "https://staging.crossmint.com";
  
  const response = await fetch(`${baseUrl}/v1/wallets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Project-Id": projectId,
      "X-Client-Secret": clientSecret,
    },
    body: JSON.stringify({
      userId,
      chain: "polygon", // Default to Polygon for lower fees
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create wallet: ${response.statusText}`);
  }

  return await response.json();
}

async function getBalance(userId: string, projectId: string, clientSecret: string, environment: string) {
  const baseUrl = environment === "production" ? "https://api.crossmint.com" : "https://staging.crossmint.com";
  
  const response = await fetch(`${baseUrl}/v1/wallets/${userId}/balance`, {
    method: "GET",
    headers: {
      "X-Project-Id": projectId,
      "X-Client-Secret": clientSecret,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get balance: ${response.statusText}`);
  }

  return await response.json();
}

async function sendPayment(userId: string, amount: string, currency: string, projectId: string, clientSecret: string, environment: string) {
  const baseUrl = environment === "production" ? "https://api.crossmint.com" : "https://staging.crossmint.com";
  
  const response = await fetch(`${baseUrl}/v1/wallets/${userId}/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Project-Id": projectId,
      "X-Client-Secret": clientSecret,
    },
    body: JSON.stringify({
      amount,
      currency,
      to: "0x0000000000000000000000000000000000000000", // Placeholder - would be actual recipient
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to send payment: ${response.statusText}`);
  }

  return await response.json();
}
