# MLB Analyst & Betting Assistant — Real‑Time Voice Agent

A production-ready MLB voice assistant that provides intelligent betting analysis through conversational AI. Users speak to the agent and receive concise scouting reports with transparent betting leans based on real data.

## 🎯 Project Overview

**Live Demo**: [https://ai-demo.live/voice/](https://ai-demo.live/voice/)

### What It Does
- **Real-time voice chat** with ElevenLabs Agent (GPT-5)
- **MLB data integration** with schedule, stats, news, and YouTube analysis
- **Betting guidance** with transparent "lean/pass" recommendations and confidence levels
- **Intelligent tool chaining** that automatically combines relevant data sources

### Architecture
- **Frontend**: Next.js 15 with ElevenLabs React SDK for voice integration
- **Voice Platform**: ElevenLabs Agent with WebSocket for full-duplex audio
- **Backend**: FastAPI with 5 specialized MLB tool endpoints
- **Security**: Netlify Functions proxy layer with token authentication
- **Deployment**: Split architecture (Netlify + Render) for scalability

## 🚀 Features

### Voice Interface
- **Real-time audio streaming** with sub-second latency
- **Conversation history** with message logging
- **Error handling** with connection status indicators

### MLB Tools
- **Schedule Checking** (`check_schedule`) - Next games and upcoming matchups
- **Team Comparisons** (`compare_stats`) - Hitting/pitching statistical analysis
- **News Updates** (`news`) - Injury reports and roster changes via NewsAPI
- **Video Analysis** (`youtube`) - Recent highlights and analysis content
- **Team Intelligence** (`team_intelligence`) - Combined scouting reports
- **Aggregator Agent** (`aggregate`) - Orchestrates multiple agents for comprehensive analysis

### Crypto & Payments
- **Wallet Management** (`wallet-manager`) - Create and manage crypto wallets
- **Payment Processing** (`payment-processor`) - Handle stablecoin payments for premium features
- **Crossmint Integration** - Enterprise-grade crypto infrastructure

### Betting Features
- **Transparent Leans** - Clear recommendations with confidence levels (low/medium/high)
- **Data-Driven Analysis** - Based on AVG/OBP/SLG, ERA/WHIP/K, injuries, and recent form
- **Educational Focus** - Guidance for smarter decisions, not financial advice
- **Pass Recommendations** - When data is insufficient or conflicting

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Voice**: ElevenLabs Agent (GPT-5) with React SDK
- **Backend**: FastAPI, Python 3.11+
- **APIs**: MLB Stats API, NewsAPI, YouTube Data API v3
- **Crypto**: Crossmint SDK for wallet management and stablecoin payments
- **Deployment**: Netlify (frontend + functions), Render (backend)
- **Security**: Token-based authentication, environment secrets

## ⚙️ Environment Variables

### Netlify (Frontend/Functions):
```
ELEVEN_API_KEY=sk-...          # Secret - ElevenLabs API key
ELEVEN_AGENT_ID=agent_...      # Optional - Agent configuration
TOOL_TOKEN=your-secret-token   # Secret - Shared authentication
BACKEND_BASE_URL=https://...   # Public - FastAPI backend URL
OPENAI_API_KEY=sk-...          # Secret - OpenAI API key for translation
TRANSLATE_MODEL=gpt-4o-mini    # OpenAI model for translation
CROSSMINT_PROJECT_ID=...       # Secret - Crossmint project ID
CROSSMINT_CLIENT_SECRET=...    # Secret - Crossmint client secret
CROSSMINT_ENVIRONMENT=staging  # Crossmint environment (staging/production)
```

### Backend (Render/Local):
```
TOOL_TOKEN=your-secret-token   # Must match Netlify value
NEWS_API_KEY=...              # Required for news endpoints
YOUTUBE_API_KEY=...           # Optional, improves video results
```

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- Netlify CLI: `npm install -g netlify-cli`

### Local Development

#### 1. Backend Setup
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8001
```

#### 2. Frontend + Functions
```powershell
npm install
netlify dev
# For ElevenLabs tool testing: netlify dev --live
```

#### 3. Access Points
- **Site**: http://localhost:8888
- **Voice Interface**: http://localhost:8888/voice
- **Backend API Docs**: http://127.0.0.1:8001/docs

### One-command local run (Windows)

```powershell
scripts\local.ps1
```

Opens the dashboard at http://localhost:8888/dashboard after starting backend and Netlify dev.

## 🚀 Deployment

### 1. Backend (Render)
- Create Web Service → Connect GitHub repo
- Root directory: `backend`
- Build: `pip install -r requirements.txt`
- Start: `uvicorn main:app --host 0.0.0.0 --port ${PORT}`
- Set environment variables: `TOOL_TOKEN`, `NEWS_API_KEY`, `YOUTUBE_API_KEY`

### 2. Frontend (Netlify)
- Connect GitHub repo → Auto-deploy from `main`
- Set environment variables (mark secrets appropriately)
- Update `BACKEND_BASE_URL` with Render service URL

## 🧪 Testing

### API Testing (PowerShell)
```powershell
$base = "https://live-ai-demo.netlify.app/.netlify/functions"
$headers = @{ "Content-Type" = "application/json"; "x-tool-token" = "your-token" }

# Schedule check
$body = @{ team = "Yankees"; days = 3; tool_token = "your-token" } | ConvertTo-Json
Invoke-RestMethod -Method POST -Uri "$base/toolsCheckSchedule" -Headers $headers -Body $body

# Team comparison
$body = @{ team1 = "Yankees"; team2 = "Red Sox"; tool_token = "your-token" } | ConvertTo-Json
Invoke-RestMethod -Method POST -Uri "$base/toolsCompareStats" -Headers $headers -Body $body
```

### Voice Testing
1. Visit `/voice` page
2. Click "Start Session" 
3. Use push-to-talk (spacebar or button)
4. Try: "Do the Yankees play tonight?" or "Red Sox vs Orioles - who has the edge?"

## 📁 Project Structure

```
├── docs/                    # Documentation and submission materials
│   ├── system-prompt.md     # ElevenLabs Agent system prompt
│   ├── project-summary.md   # Hackathon submission summary
│   └── development-process.md # Complete development documentation
├── src/app/
│   ├── page.tsx            # Homepage with videos and architecture
│   ├── voice/page.tsx      # Voice chat interface
│   └── layout.tsx          # Root layout and metadata
├── netlify/functions/
│   ├── elevenSignedUrl.ts  # WebSocket broker for ElevenLabs
│   ├── tools*.ts           # Proxy functions for each tool
│   └── _lib/toolsProxy.ts  # Shared proxy helper
├── backend/
│   ├── main.py             # FastAPI app with 5 tool endpoints
│   ├── mlb_service.py      # MLB stats and schedule logic
│   ├── news_service.py     # NewsAPI integration
│   ├── youtube_service.py  # YouTube search and metadata
│   └── requirements.txt    # Python dependencies
└── README.md
```

## 🔧 Troubleshooting

- **404 on Functions**: Use `elevenSignedUrl` (no hyphens) instead of `eleven-signed-url`
- **Empty PowerShell Results**: Pipe to JSON: `| ConvertTo-Json -Depth 8`
- **News Tool Empty**: Ensure `NEWS_API_KEY` (not `NEWSAPI_KEY`) is set on backend
- **YouTube Errors**: Check httpx version compatibility in requirements.txt
- **Voice Connection Issues**: Verify `ELEVEN_API_KEY` and agent configuration

## 📚 Documentation

- **[System Prompt](docs/system-prompt.md)** - ElevenLabs Agent configuration
- **[Technical Report](docs/one-page-report.md)** - Architecture and implementation details
- **[Hackathon Submission Checklist](docs/submission-checklist.md)**

## 🤝 Coral Protocol (Hackathon)

- Manifest endpoint: `/.netlify/functions/coral-manifest`
- Invoke router: `/.netlify/functions/coral-invoke`
- Demo runner UI: `/agents`
- Listing template: [docs/coral-registry-listing.md](docs/coral-registry-listing.md)

Example invoke body:
```json
{ "agent": "news-brief", "method": "invoke", "params": { "team": "Yankees", "limit": 3 } }
```

---

Built by Mujib ur Rahman
