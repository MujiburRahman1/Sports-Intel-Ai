import { handleOptions, NetlifyEvent } from "./_lib/toolsProxy";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-tool-token",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
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

  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const base = getBaseUrl(event);
  const fn = (name: string) => (base ? `${base}/.netlify/functions/${name}` : `/.netlify/functions/${name}`);

  const manifest = {
    name: "Sports Intelligence Agents",
    description: "Agents for sports data, news briefs, YouTube scouting, and text-to-speech.",
    version: "1.0.0",
    documentation_url: base ? `${base}/` : undefined,
    agents: [
      {
        id: "news-brief",
        name: "NewsBriefAgent",
        description: "Fetch latest sports news and return a summarized brief.",
        methods: [
          {
            name: "invoke",
            http: { method: "POST", url: fn("toolsNews") },
            input_schema: {
              type: "object",
              additionalProperties: true,
              properties: {
                team: { type: "string" },
                league: { type: "string" },
                limit: { type: "number", minimum: 1, maximum: 10 },
              },
            },
            auth: { type: "header", header: "x-tool-token", optional: true },
          },
        ],
      },
      {
        id: "sports-compare-stats",
        name: "SportsCompareStatsAgent",
        description: "Compare players/teams by key statistics.",
        methods: [
          {
            name: "invoke",
            http: { method: "POST", url: fn("toolsCompareStats") },
            input_schema: { type: "object", additionalProperties: true },
            auth: { type: "header", header: "x-tool-token", optional: true },
          },
        ],
      },
      {
        id: "sports-check-schedule",
        name: "SportsCheckScheduleAgent",
        description: "Get upcoming schedules or past game results.",
        methods: [
          {
            name: "invoke",
            http: { method: "POST", url: fn("toolsCheckSchedule") },
            input_schema: { type: "object", additionalProperties: true },
            auth: { type: "header", header: "x-tool-token", optional: true },
          },
        ],
      },
      {
        id: "team-intelligence",
        name: "TeamIntelligenceAgent",
        description: "Generate team insights by combining stats, trends, and news.",
        methods: [
          {
            name: "invoke",
            http: { method: "POST", url: fn("toolsTeamIntelligence") },
            input_schema: { type: "object", additionalProperties: true },
            auth: { type: "header", header: "x-tool-token", optional: true },
          },
        ],
      },
      {
        id: "youtube-scout",
        name: "YouTubeScoutAgent",
        description: "Find and summarize highlight videos for teams and players.",
        methods: [
          {
            name: "invoke",
            http: { method: "POST", url: fn("toolsYoutube") },
            input_schema: { type: "object", additionalProperties: true },
            auth: { type: "header", header: "x-tool-token", optional: true },
          },
        ],
      },
      {
        id: "voice-tts",
        name: "VoiceTTSAgent",
        description: "Convert text briefs to speech audio using existing TTS function.",
        methods: [
          {
            name: "invoke",
            http: { method: "POST", url: fn("tts") },
            input_schema: { type: "object", additionalProperties: true },
            auth: { type: "header", header: "x-tool-token", optional: true },
          },
        ],
      },
      {
        id: "aggregate",
        name: "AggregatorAgent",
        description: "Orchestrate multiple agents (schedule, compare, news, youtube) and summarize.",
        methods: [
          {
            name: "invoke",
            http: { method: "POST", url: fn("toolsAggregate") },
            input_schema: { type: "object", additionalProperties: true },
            auth: { type: "header", header: "x-tool-token", optional: true },
          },
        ],
      },
      {
        id: "wallet-manager",
        name: "WalletManagerAgent",
        description: "Manage crypto wallets, check balances, and handle payments for premium agent access.",
        methods: [
          {
            name: "invoke",
            http: { method: "POST", url: fn("crossmint-wallet") },
            input_schema: {
              type: "object",
              properties: {
                action: { type: "string", enum: ["create_wallet", "get_balance", "send_payment"] },
                userId: { type: "string" },
                amount: { type: "string" },
                currency: { type: "string", default: "USDC" },
              },
              required: ["action", "userId"],
            },
            auth: { type: "header", header: "x-tool-token", optional: true },
          },
        ],
      },
      {
        id: "payment-processor",
        name: "PaymentProcessorAgent",
        description: "Process payments for premium agent features using stablecoins and crypto payments.",
        methods: [
          {
            name: "invoke",
            http: { method: "POST", url: fn("crossmint-payment") },
            input_schema: {
              type: "object",
              properties: {
                userId: { type: "string" },
                agentId: { type: "string" },
                amount: { type: "string" },
                currency: { type: "string", default: "USDC" },
                description: { type: "string" },
              },
              required: ["userId", "agentId", "amount"],
            },
            auth: { type: "header", header: "x-tool-token", optional: true },
          },
        ],
      },
      {
        id: "mistral-reasoning",
        name: "MistralReasoningAgent",
        description: "Advanced reasoning agent using Mistral AI for comprehensive MLB analysis and insights.",
        methods: [
          {
            name: "invoke",
            http: { method: "POST", url: fn("mistral-reasoning") },
            input_schema: {
              type: "object",
              properties: {
                team1: { type: "string" },
                team2: { type: "string" },
                context: { type: "string" },
                question: { type: "string" },
              },
              required: ["team1", "team2"],
            },
            auth: { type: "header", header: "x-tool-token", optional: true },
          },
        ],
      },
      {
        id: "mistral-codestral",
        name: "MistralCodestralAgent",
        description: "Code generation agent using Mistral Codestral for sports analytics, NFT metadata, and betting calculators.",
        methods: [
          {
            name: "invoke",
            http: { method: "POST", url: fn("mistral-codestral") },
            input_schema: {
              type: "object",
              properties: {
                type: { type: "string", enum: ["sports_analytics", "nft_metadata", "betting_calculator"] },
                language: { type: "string", default: "Python" },
                requirements: { type: "string" },
                context: { type: "string" },
              },
              required: ["type", "requirements"],
            },
            auth: { type: "header", header: "x-tool-token", optional: true },
          },
        ],
      },
      {
        id: "mistral-multilingual",
        name: "MistralMultilingualAgent",
        description: "Multilingual translation agent using Mistral for real-time sports analysis in multiple languages.",
        methods: [
          {
            name: "invoke",
            http: { method: "POST", url: fn("mistral-multilingual") },
            input_schema: {
              type: "object",
              properties: {
                text: { type: "string" },
                target_language: { type: "string", default: "English" },
                context: { type: "string" },
                voice_mode: { type: "boolean", default: false },
              },
              required: ["text", "target_language"],
            },
            auth: { type: "header", header: "x-tool-token", optional: true },
          },
        ],
      },
      {
        id: "mistral-nft-metadata",
        name: "MistralNFTMetadataAgent",
        description: "NFT metadata generation agent using Mistral for sports achievement badges and collectibles.",
        methods: [
          {
            name: "invoke",
            http: { method: "POST", url: fn("mistral-nft-metadata") },
            input_schema: {
              type: "object",
              properties: {
                player_name: { type: "string" },
                team: { type: "string" },
                achievement: { type: "string" },
                rarity: { type: "string", default: "Common" },
                language: { type: "string", default: "English" },
              },
              required: ["player_name", "team", "achievement"],
            },
            auth: { type: "header", header: "x-tool-token", optional: true },
          },
        ],
      },
      {
        id: "nba-stats",
        name: "NBAStatsAgent",
        description: "NBA-specific stats agent for basketball teams with comprehensive statistics, news, schedule, and analysis.",
        methods: [
          {
            name: "invoke",
            http: { method: "POST", url: fn("toolsNBA") },
            input_schema: {
              type: "object",
              properties: {
                team: { type: "string", description: "NBA team name (e.g., Lakers, Warriors, Celtics)" },
                action: { type: "string", enum: ["stats", "news", "schedule", "compare"], default: "stats" },
                context: { type: "string" },
              },
              required: ["team"],
            },
            auth: { type: "header", header: "x-tool-token", optional: true },
          },
        ],
      },
      {
        id: "nfl-stats",
        name: "NFLStatsAgent",
        description: "NFL-specific stats agent for American football teams with comprehensive statistics, news, schedule, and analysis.",
        methods: [
          {
            name: "invoke",
            http: { method: "POST", url: fn("toolsNFL") },
            input_schema: {
              type: "object",
              properties: {
                team: { type: "string", description: "NFL team name (e.g., Chiefs, Bills, Bengals)" },
                action: { type: "string", enum: ["stats", "news", "schedule", "compare"], default: "stats" },
                context: { type: "string" },
              },
              required: ["team"],
            },
            auth: { type: "header", header: "x-tool-token", optional: true },
          },
        ],
      },
      {
        id: "multi-sport",
        name: "MultiSportAgent",
        description: "Unified sports agent supporting MLB, NBA, Cricket, Football, and F1 with stats, news, schedule, and analysis.",
        methods: [
          {
            name: "invoke",
            http: { method: "POST", url: fn("toolsMultiSport") },
            input_schema: {
              type: "object",
              properties: {
                sport: { type: "string", enum: ["mlb", "nba", "cricket", "football", "f1"] },
                team: { type: "string" },
                action: { type: "string", enum: ["stats", "news", "schedule", "compare"], default: "stats" },
                context: { type: "string" },
              },
              required: ["sport", "team"],
            },
            auth: { type: "header", header: "x-tool-token", optional: true },
          },
        ],
      },
      {
        id: "pipeline",
        name: "PipelineAgent",
        description: "Multi-agent pipeline that chains stats → voice → scouting agents for comprehensive team analysis.",
        methods: [
          {
            name: "invoke",
            http: { method: "POST", url: fn("toolsPipeline") },
            input_schema: {
              type: "object",
              properties: {
                team: { type: "string", description: "Team name (e.g., Lakers, Yankees, Chiefs)" },
                sport: { type: "string", enum: ["mlb", "nba", "nfl", "cricket", "football", "f1"], default: "mlb" },
                context: { type: "string", description: "Additional context for analysis" },
              },
              required: ["team"],
            },
            auth: { type: "header", header: "x-tool-token", optional: true },
          },
        ],
      },
      {
        id: "sentiment-agent",
        name: "SentimentAnalysisAgent",
        description: "Analyzes fan sentiment from social media platforms (Twitter, Reddit) for sports teams using AI-powered sentiment analysis.",
        methods: [
          {
            name: "invoke",
            http: { method: "POST", url: fn("toolsSentiment") },
            input_schema: {
              type: "object",
              properties: {
                team: { type: "string", description: "Team name to analyze sentiment for" },
                sport: { type: "string", enum: ["mlb", "nba", "nfl", "cricket", "football", "f1"], default: "mlb" },
                platform: { type: "string", enum: ["twitter", "reddit", "both"], default: "twitter" },
                days_back: { type: "integer", minimum: 1, maximum: 30, default: 7, description: "Days back to analyze sentiment" },
              },
              required: ["team"],
            },
            auth: { type: "header", header: "x-tool-token", optional: true },
          },
        ],
      },
      {
        id: "predict-agent",
        name: "PredictionAgent",
        description: "Generates win probabilities, score predictions, and season outlooks using advanced analytics and AI-powered insights.",
        methods: [
          {
            name: "invoke",
            http: { method: "POST", url: fn("toolsPredict") },
            input_schema: {
              type: "object",
              properties: {
                team: { type: "string", description: "Team name to predict for" },
                opponent: { type: "string", description: "Opponent team name" },
                sport: { type: "string", enum: ["mlb", "nba", "nfl", "cricket", "football", "f1"], default: "mlb" },
                prediction_type: { type: "string", enum: ["win_probability", "score_prediction", "season_outlook"], default: "win_probability" },
                context: { type: "string", description: "Additional context for prediction analysis" },
              },
              required: ["team", "opponent"],
            },
            auth: { type: "header", header: "x-tool-token", optional: true },
          },
        ],
      },
      {
        id: "visual-analytics-agent",
        name: "VisualAnalyticsAgent",
        description: "Generates advanced visual analytics including heatmaps, spray charts, trend analysis, and performance matrices with interactive chart data.",
        methods: [
          {
            name: "invoke",
            http: { method: "POST", url: fn("toolsVisualAnalytics") },
            input_schema: {
              type: "object",
              properties: {
                team: { type: "string", description: "Team name to analyze" },
                sport: { type: "string", enum: ["mlb", "nba", "nfl", "cricket", "football", "f1"], default: "mlb" },
                chart_type: { type: "string", enum: ["heatmap", "spray_chart", "trend_analysis", "performance_matrix"], default: "heatmap" },
                data_period: { type: "string", enum: ["last_5_games", "last_10_games", "season", "career"], default: "season" },
                metrics: { type: "array", items: { type: "string" }, default: ["performance", "statistics"] },
                context: { type: "string", description: "Additional context for visual analysis" },
              },
              required: ["team"],
            },
            auth: { type: "header", header: "x-tool-token", optional: true },
          },
        ],
      },
      {
        id: "personalized-agent",
        name: "PersonalizedAgent",
        description: "Creates user-specific agents based on favorite team and personal preferences with dynamic runtime manifest generation.",
        methods: [
          {
            name: "invoke",
            http: { method: "POST", url: fn("toolsPersonalizedAgent") },
            input_schema: {
              type: "object",
              properties: {
                user_id: { type: "string", description: "Unique user identifier" },
                favorite_team: { type: "string", description: "User's favorite team" },
                sport: { type: "string", enum: ["mlb", "nba", "nfl", "cricket", "football", "f1"], default: "mlb" },
                preferences: { type: "object", description: "User-specific preferences and settings" },
                agent_type: { type: "string", enum: ["team_agent", "custom_analyst", "personal_scout"], default: "team_agent" },
                context: { type: "string", description: "Additional context for personalized agent creation" },
              },
              required: ["user_id", "favorite_team"],
            },
            auth: { type: "header", header: "x-tool-token", optional: true },
          },
        ],
      },
    ],
  } as const;

  return {
    statusCode: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    body: JSON.stringify(manifest, null, 2),
  };
}


