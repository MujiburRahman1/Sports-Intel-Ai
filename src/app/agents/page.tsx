"use client";

import { useMemo, useState } from "react";

type AgentId =
  | "news-brief"
  | "sports-compare-stats"
  | "sports-check-schedule"
  | "team-intelligence"
  | "youtube-scout"
  | "voice-tts";

interface LogEntry {
  id: string;
  level: "info" | "error";
  message: string;
}

export default function AgentsRunnerPage() {
  const [agent, setAgent] = useState<AgentId>("news-brief");
  const [params, setParams] = useState<string>("{\n  \"team\": \"Yankees\",\n  \"limit\": 3\n}");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const presets = useMemo(
    () => ({
      "Game-day brief": {
        agent: "team-intelligence" as AgentId,
        params: { team: "Yankees", opponent: "Red Sox", date: "today" },
      },
      "Latest news": { agent: "news-brief" as AgentId, params: { team: "Yankees", limit: 3 } },
      "Schedule check": {
        agent: "sports-check-schedule" as AgentId,
        params: { team: "Yankees", range: "next-7-days" },
      },
      "Scout on YouTube": { agent: "youtube-scout" as AgentId, params: { query: "Yankees highlights" } },
    }),
    []
  );

  function pushLog(level: LogEntry["level"], message: string) {
    setLogs((prev) => [...prev, { id: `${Date.now()}-${Math.random()}`, level, message }]);
  }

  async function run() {
    setLoading(true);
    setResult("");
    setLogs([]);
    try {
      pushLog("info", `Calling agent ${agent}...`);
      const resp = await fetch("/.netlify/functions/coral-invoke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent, method: "invoke", params: JSON.parse(params || "{}") }),
      });
      const contentType = resp.headers.get("content-type") || "application/json";
      const text = await resp.text();
      setResult(contentType.includes("application/json") ? pretty(text) : text);
      pushLog("info", `Status ${resp.status}`);
    } catch (e: any) {
      pushLog("error", e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  function pretty(value: string) {
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value;
    }
  }

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Agents Runner</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Agent</label>
          <select
            className="w-full border rounded p-2 bg-white"
            value={agent}
            onChange={(e) => setAgent(e.target.value as AgentId)}
          >
            <option value="news-brief">NewsBriefAgent</option>
            <option value="sports-compare-stats">SportsCompareStatsAgent</option>
            <option value="sports-check-schedule">SportsCheckScheduleAgent</option>
            <option value="team-intelligence">TeamIntelligenceAgent</option>
            <option value="youtube-scout">YouTubeScoutAgent</option>
            <option value="voice-tts">VoiceTTSAgent</option>
          </select>

          <label className="block text-sm font-medium">Params (JSON)</label>
          <textarea
            className="w-full border rounded p-2 font-mono text-sm min-h-[180px]"
            value={params}
            onChange={(e) => setParams(e.target.value)}
          />

          <button
            disabled={loading}
            onClick={run}
            className="w-full bg-black text-white rounded p-2 disabled:opacity-50"
          >
            {loading ? "Running..." : "Run"}
          </button>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Presets</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(presets).map(([label, cfg]) => (
                <button
                  key={label}
                  className="border rounded px-2 py-1 text-sm hover:bg-gray-50"
                  onClick={() => {
                    setAgent(cfg.agent);
                    setParams(JSON.stringify(cfg.params, null, 2));
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-medium">Result</label>
          <pre className="w-full border rounded p-3 bg-gray-50 text-sm overflow-auto min-h-[220px] whitespace-pre-wrap">
            {result || "(no result yet)"}
          </pre>

          <label className="block text-sm font-medium">Logs</label>
          <div className="w-full border rounded p-3 bg-white text-sm min-h-[120px] space-y-1">
            {logs.length === 0 ? (
              <div className="text-gray-500">(no logs yet)</div>
            ) : (
              logs.map((l) => (
                <div key={l.id} className={l.level === "error" ? "text-red-600" : "text-gray-800"}>
                  {l.message}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


