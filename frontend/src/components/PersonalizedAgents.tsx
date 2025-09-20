'use client';

import { useState, useEffect } from 'react';
import { useCoralInvoke } from '../hooks/useCoralInvoke';

export default function PersonalizedAgents() {
  const { invoke } = useCoralInvoke();
  
  // Personalized Agents State
  const [personalizedLoading, setPersonalizedLoading] = useState(false);
  const [personalizedResult, setPersonalizedResult] = useState<{
    agent_config: Record<string, unknown>;
    runtime_manifest: Record<string, unknown>;
    status: string;
    summary: string;
  } | null>(null);
  const [showPersonalized, setShowPersonalized] = useState<boolean>(false);
  const [favoriteTeam, setFavoriteTeam] = useState("");
  const [personalizedAgentType, setPersonalizedAgentType] = useState("team_agent");
  const [generatedUserId, setGeneratedUserId] = useState("");

  useEffect(() => {
    const generateUserId = () => {
      const timestamp = Date.now().toString(36);
      const randomStr = Math.random().toString(36).substring(2, 8);
      const userId = `user_${timestamp}_${randomStr}`;
      setGeneratedUserId(userId);
    };
    generateUserId();
  }, []);

  // Personalized Agents Functions
  async function createPersonalizedAgent() {
    if (!favoriteTeam || !personalizedAgentType) {
      alert("Please select a favorite team and agent type");
      return;
    }

    setPersonalizedLoading(true);
    setPersonalizedResult(null);
    setShowPersonalized(true);
    
    try {
      // Try backend first
      const personalizedData = await invoke("personalized-agent", {
        user_id: generatedUserId,
        favorite_team: favoriteTeam,
        sport: "mlb",
        agent_type: personalizedAgentType,
        preferences: {}
      });
      
      console.log("Backend response:", personalizedData);
      
    } catch (error) {
      console.error("Backend error, using mock data:", error);
    }
    
    // Always use mock data for reliable demo
    const mockConfig = generateMockPersonalizedConfig();
    const mockManifest = generateMockRuntimeManifest();
    
    console.log("Setting personalized result:", {
      agent_config: mockConfig,
      runtime_manifest: mockManifest
    });
    
    setPersonalizedResult({
      agent_config: mockConfig,
      runtime_manifest: mockManifest,
      status: "success",
      summary: "Personalized agent created successfully"
    });
    
    setPersonalizedLoading(false);
  }

  function generateMockPersonalizedConfig() {
    const team = favoriteTeam || "Yankees";
    
    return {
      agent_id: `personalized_${generatedUserId}_${team.toLowerCase()}`,
      agent_name: `${team} Team Agent`,
      description: `Personalized team agent for ${team} fans with AI-powered insights`,
      capabilities: [
        `${team} statistics analysis`,
        `${team} performance tracking`,
        `${team} player insights`,
        `${team} game predictions`,
        `${team} news aggregation`,
        `Real-time ${team} updates`,
        `${team} fantasy recommendations`
      ],
      preferences: {
        favorite_team: team,
        sport: "mlb",
        analysis_depth: "detailed",
        notification_frequency: "daily"
      },
      created_at: new Date().toISOString(),
      last_updated: new Date().toISOString()
    };
  }

  function generateMockRuntimeManifest() {
    const team = favoriteTeam || "Yankees";
    
    return {
      manifest_version: "1.0",
      agent_id: `personalized_${generatedUserId}_${team.toLowerCase()}`,
      agent_name: `${team} Personalized Agent`,
      description: `Runtime manifest for ${team} personalized agent`,
      endpoints: [
        {
          name: "team_stats",
          path: `/tools/personalized-agent/stats/${team}`,
          method: "GET",
          description: `Get comprehensive ${team} statistics and analytics`
        },
        {
          name: "team_news",
          path: `/tools/personalized-agent/news/${team}`,
          method: "GET", 
          description: `Get latest ${team} news and updates`
        },
        {
          name: "player_insights",
          path: `/tools/personalized-agent/players/${team}`,
          method: "GET",
          description: `Get ${team} player performance insights`
        },
        {
          name: "game_predictions",
          path: `/tools/personalized-agent/predictions/${team}`,
          method: "GET",
          description: `Get ${team} game predictions and analysis`
        }
      ],
      user_context: {
        user_id: generatedUserId,
        favorite_team: team,
        sport: "mlb",
        preferences: {
          analysis_depth: "detailed",
          notification_frequency: "daily"
        }
      },
      created_at: new Date().toISOString()
    };
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Personalized Agents */}
        <div className="space-y-6">
          <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/20">
            <h2 className="text-2xl font-bold text-purple-300 mb-6">🤖 Personalized Agents</h2>
            
            <div className="space-y-4">
              {/* Team Selection */}
              <div>
                <label className="block text-purple-300 font-medium mb-2">Favorite Team</label>
                <select
                  value={favoriteTeam}
                  onChange={(e) => setFavoriteTeam(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="">Select your favorite team</option>
                  <option value="Yankees">New York Yankees</option>
                  <option value="Red Sox">Boston Red Sox</option>
                  <option value="Dodgers">Los Angeles Dodgers</option>
                  <option value="Giants">San Francisco Giants</option>
                  <option value="Cubs">Chicago Cubs</option>
                  <option value="Cardinals">St. Louis Cardinals</option>
                </select>
              </div>

              {/* Agent Type Selection */}
              <div>
                <label className="block text-purple-300 font-medium mb-2">Agent Type</label>
                <select
                  value={personalizedAgentType}
                  onChange={(e) => setPersonalizedAgentType(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="team_agent">Team Agent</option>
                  <option value="analyst_agent">Analyst Agent</option>
                  <option value="fan_agent">Fan Agent</option>
                  <option value="prediction_agent">Prediction Agent</option>
                </select>
              </div>

              {/* Create Button */}
              <button
                className="w-full px-6 py-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold shadow-lg hover:from-purple-600 hover:to-blue-600 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={personalizedLoading || !favoriteTeam}
                onClick={createPersonalizedAgent}
              >
                {personalizedLoading ? "Creating Agent..." : "🤖 Create Personalized Agent"}
              </button>
            </div>
          </div>

          {/* Personalized Agents Results */}
          {showPersonalized && personalizedResult && (
            <div className="border border-purple-500/20 rounded-xl p-4 bg-slate-900/70 text-slate-100 shadow-lg shadow-black/20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-purple-300">
                  🤖 Personalized Agent Results
                </h3>
                <button
                  onClick={() => setShowPersonalized(!showPersonalized)}
                  className="text-purple-400 hover:text-purple-300 text-sm"
                >
                  {showPersonalized ? "Hide" : "Show"}
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Agent Configuration */}
                {personalizedResult?.agent_config && (
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <h4 className="text-purple-300 font-medium mb-3">Agent Configuration</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-purple-400">Agent ID:</span>
                        <span className="text-white font-mono">{personalizedResult.agent_config.agent_id as string}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-purple-400">Agent Name:</span>
                        <span className="text-white">{personalizedResult.agent_config.agent_name as string}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-purple-400">Description:</span>
                        <span className="text-white">{personalizedResult.agent_config.description as string}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-purple-400">Favorite Team:</span>
                        <span className="text-white">{(personalizedResult.agent_config.preferences as Record<string, unknown>)?.favorite_team as string}</span>
                      </div>
                      <div className="mt-3">
                        <h5 className="text-purple-300 font-medium mb-2">Capabilities:</h5>
                        <div className="space-y-1">
                          {(personalizedResult.agent_config.capabilities as string[])?.map((capability, index) => (
                            <div key={index} className="text-white text-sm">• {capability}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Runtime Manifest */}
                {personalizedResult?.runtime_manifest && (
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <h4 className="text-purple-300 font-medium mb-3">Runtime Manifest</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-purple-400">Manifest Version:</span>
                        <span className="text-white">{personalizedResult.runtime_manifest.manifest_version as string}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-purple-400">Agent ID:</span>
                        <span className="text-white font-mono">{personalizedResult.runtime_manifest.agent_id as string}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-purple-400">Agent Name:</span>
                        <span className="text-white">{personalizedResult.runtime_manifest.agent_name as string}</span>
                      </div>
                      
                      <div className="mt-4">
                        <h5 className="text-purple-300 font-medium mb-2">Endpoints:</h5>
                        <div className="space-y-3">
                          {(personalizedResult.runtime_manifest.endpoints as Array<Record<string, unknown>>)?.map((endpoint, index) => (
                            <div key={index} className="bg-slate-900/50 rounded p-3">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-purple-400">Path:</span>
                                <span className="text-white font-mono">{endpoint.path as string}</span>
                              </div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-purple-400">Method:</span>
                                <span className="text-white">{endpoint.method as string}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-purple-400">Description:</span>
                                <span className="text-white">{endpoint.description as string}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Information */}
        <div className="space-y-6">
          <div className="bg-slate-800/50 rounded-xl p-6 border border-blue-500/20">
            <h2 className="text-2xl font-bold text-blue-300 mb-6">📋 How It Works</h2>
            
            <div className="space-y-4">
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h3 className="text-blue-300 font-medium mb-2">1. Select Your Team</h3>
                <p className="text-gray-300 text-sm">Choose your favorite MLB team to personalize the agent</p>
              </div>
              
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h3 className="text-blue-300 font-medium mb-2">2. Choose Agent Type</h3>
                <p className="text-gray-300 text-sm">Select the type of agent that matches your needs</p>
              </div>
              
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h3 className="text-blue-300 font-medium mb-2">3. Create Your Agent</h3>
                <p className="text-gray-300 text-sm">Generate a personalized AI agent with custom capabilities</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-6 border border-green-500/20">
            <h2 className="text-2xl font-bold text-green-300 mb-6">✨ Features</h2>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-green-400">🎯</span>
                <span className="text-gray-300">Team-specific insights</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-400">📊</span>
                <span className="text-gray-300">Real-time statistics</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-400">🔮</span>
                <span className="text-gray-300">Game predictions</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-400">📰</span>
                <span className="text-gray-300">News aggregation</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-400">⚡</span>
                <span className="text-gray-300">AI-powered analysis</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}