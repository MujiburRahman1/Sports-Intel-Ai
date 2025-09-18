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
    const { userId, agentId, amount, currency = "USDC", description } = JSON.parse(event.body || "{}");

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

    // Create payment intent for agent access
    const paymentIntent = await createPaymentIntent({
      userId,
      agentId,
      amount,
      currency,
      description: description || `Premium access to ${agentId} agent`,
      projectId: CROSSMINT_PROJECT_ID,
      clientSecret: CROSSMINT_CLIENT_SECRET,
      environment: CROSSMINT_ENVIRONMENT,
    });

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        paymentIntent,
        message: "Payment intent created successfully",
      }),
    };
  } catch (error) {
    console.error("Crossmint payment error:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Payment processing failed" }),
    };
  }
}

async function createPaymentIntent({
  userId,
  agentId,
  amount,
  currency,
  description,
  projectId,
  clientSecret,
  environment,
}: {
  userId: string;
  agentId: string;
  amount: string;
  currency: string;
  description: string;
  projectId: string;
  clientSecret: string;
  environment: string;
}) {
  const baseUrl = environment === "production" ? "https://api.crossmint.com" : "https://staging.crossmint.com";
  
  const response = await fetch(`${baseUrl}/v1/payments/intents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Project-Id": projectId,
      "X-Client-Secret": clientSecret,
    },
    body: JSON.stringify({
      userId,
      amount,
      currency,
      description,
      metadata: {
        agentId,
        service: "sports-intelligence-agent",
        timestamp: new Date().toISOString(),
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create payment intent: ${response.statusText}`);
  }

  return await response.json();
}
