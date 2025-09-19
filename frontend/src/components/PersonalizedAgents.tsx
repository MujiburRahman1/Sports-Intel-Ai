'use client';

import { useState, useEffect } from 'react';
import { useCoralInvoke } from '../hooks/useCoralInvoke';

export default function PersonalizedAgents() {
  const { invoke } = useCoralInvoke();
  
  // Personalized Agents State
  const [personalizedLoading, setPersonalizedLoading] = useState(false);
  const [personalizedResult, setPersonalizedResult] = useState<{
    config: Record<string, unknown>;
    manifest: Record<string, unknown>;
    timestamp: string;
  } | null>(null);
  const [showPersonalized, setShowPersonalized] = useState<boolean>(false);
  const [favoriteTeam, setFavoriteTeam] = useState("");
  const [personalizedAgentType, setPersonalizedAgentType] = useState("team_agent");
  const [generatedUserId, setGeneratedUserId] = useState("");

  // Gamification State
  const [gamificationLoading, setGamificationLoading] = useState(false);
  const [gamificationResult, setGamificationResult] = useState<{
    question?: string;
    options?: string[];
    answer?: string;
    score?: number;
    leaderboard?: Array<{user: string; score: number}>;
    timestamp: string;
  } | null>(null);
  const [showGamification, setShowGamification] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<{
    question: string;
    options: string[];
    correct_answer: number;
    explanation: string;
  } | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [userScore, setUserScore] = useState({ trivia_points: 0, prediction_points: 0, total_points: 0 });

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
      const personalizedData = await invoke("personalized-agent", {
        user_id: generatedUserId,
        favorite_team: favoriteTeam,
        sport: "mlb",
        agent_type: personalizedAgentType,
        preferences: {}
      });
      
      if (personalizedData?.agent_config) {
        setPersonalizedResult({
          agent_config: personalizedData.agent_config,
          runtime_manifest: personalizedData.runtime_manifest,
          status: "success",
          summary: personalizedData.summary
        });
      }
    } catch (error) {
      console.error("Personalized agent error:", error);
      
      // Fallback to mock data
      const mockConfig = generateMockPersonalizedConfig();
      const mockManifest = generateMockRuntimeManifest();
      
      setPersonalizedResult({
        agent_config: mockConfig,
        runtime_manifest: mockManifest,
        status: "success",
        summary: "Mock personalized agent created successfully"
      });
    } finally {
      setPersonalizedLoading(false);
    }
  }

  function generateMockPersonalizedConfig() {
    const team = favoriteTeam || "Yankees";
    
    return {
      agent_id: `personalized_${generatedUserId}_${team.toLowerCase()}`,
      agent_name: `${team} Team Agent`,
      description: `Personalized team agent for ${team} fans`,
      capabilities: [
        `${team} statistics analysis`,
        `${team} performance tracking`,
        `${team} player insights`,
        `${team} game predictions`,
        `${team} news aggregation`
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
          url: `/tools/personalized-agent/stats/${team}`,
          method: "GET",
          description: `Get ${team} statistics`
        },
        {
          name: "team_news",
          url: `/tools/personalized-agent/news/${team}`,
          method: "GET", 
          description: `Get ${team} latest news`
        }
      ],
      user_context: {
        user_id: generatedUserId,
        favorite_team: team,
        preferences: {}
      },
      created_at: new Date().toISOString()
    };
  }

  // Gamification Functions
  async function getTriviaQuestion() {
    setGamificationLoading(true);
    setGamificationResult(null);
    setShowGamification(true);
    
    try {
      const triviaData = await invoke("gamification-agent", {
        user_id: generatedUserId,
        action: "get_trivia"
      });
      
      if (triviaData?.question) {
        setCurrentQuestion(triviaData.question);
        setSelectedAnswer(null);
        setGamificationResult({
          action: "get_trivia",
          question: triviaData.question,
          status: "success",
          summary: triviaData.summary
        });
      }
    } catch (error) {
      console.error("Trivia error:", error);
      
      // Fallback to mock data
      const mockQuestion = generateMockTriviaQuestion();
      setCurrentQuestion(mockQuestion);
      setSelectedAnswer(null);
      setGamificationResult({
        action: "get_trivia",
        question: mockQuestion,
        status: "success",
        summary: "Mock trivia question loaded"
      });
    } finally {
      setGamificationLoading(false);
    }
  }

  async function submitTriviaAnswer() {
    if (selectedAnswer === null || !currentQuestion) return;
    
    setGamificationLoading(true);
    
    try {
      const result = await invoke("gamification-agent", {
        user_id: generatedUserId,
        action: "submit_answer",
        question_id: currentQuestion.question_id,
        answer: selectedAnswer
      });
      
      if (result?.result) {
        setGamificationResult({
          action: "submit_answer",
          result: result.result,
          user_stats: result.user_stats,
          status: "success",
          summary: result.summary
        });
        
        if (result.user_stats) {
          setUserScore(result.user_stats);
        }
        
        setCurrentQuestion(null);
        setSelectedAnswer(null);
      }
    } catch (error) {
      console.error("Submit answer error:", error);
      
      // Fallback to mock result
      const isCorrect = selectedAnswer === currentQuestion.correct_answer;
      const pointsAwarded = isCorrect ? currentQuestion.points : 0;
      
      setGamificationResult({
        action: "submit_answer",
        result: {
          correct: isCorrect,
          points_awarded: pointsAwarded,
          correct_answer: currentQuestion.correct_answer,
          explanation: `The correct answer is: ${currentQuestion.options[currentQuestion.correct_answer]}`
        },
        user_stats: {
          total_points: userScore.total_points + pointsAwarded,
          trivia_points: userScore.trivia_points + pointsAwarded
        },
        status: "success",
        summary: `Answer ${isCorrect ? 'correct' : 'incorrect'}! ${isCorrect ? '+' + pointsAwarded + ' points' : 'No points awarded'}`
      });
      
      setUserScore(prev => ({
        ...prev,
        total_points: prev.total_points + pointsAwarded,
        trivia_points: prev.trivia_points + pointsAwarded
      }));
      
      setCurrentQuestion(null);
      setSelectedAnswer(null);
    } finally {
      setGamificationLoading(false);
    }
  }

  async function getLeaderboard() {
    setGamificationLoading(true);
    setShowGamification(true);
    
    try {
      const leaderboardData = await invoke("gamification-agent", {
        user_id: generatedUserId,
        action: "get_leaderboard"
      });
      
      if (leaderboardData?.leaderboard) {
        setGamificationResult({
          action: "get_leaderboard",
          leaderboard: leaderboardData.leaderboard,
          user_stats: leaderboardData.user_stats,
          status: "success",
          summary: leaderboardData.summary
        });
        
        if (leaderboardData.user_stats) {
          setUserScore(leaderboardData.user_stats);
        }
      }
    } catch (error) {
      console.error("Leaderboard error:", error);
      
      // Fallback to mock data
      const mockLeaderboard = generateMockLeaderboard();
      setGamificationResult({
        action: "get_leaderboard",
        leaderboard: mockLeaderboard,
        user_stats: { trivia_points: 0, prediction_points: 0, total_points: 0 },
        status: "success",
        summary: "Mock leaderboard data loaded"
      });
    } finally {
      setGamificationLoading(false);
    }
  }

  function generateMockTriviaQuestion() {
    const questions = [
      {
        question_id: "q1",
        question: "Which team has won the most World Series championships?",
        options: ["Yankees", "Red Sox", "Dodgers", "Giants"],
        correct_answer: 0,
        sport: "mlb",
        difficulty: "medium",
        points: 10
      },
      {
        question_id: "q2",
        question: "Who holds the record for most home runs in a single season?",
        options: ["Barry Bonds", "Mark McGwire", "Sammy Sosa", "Babe Ruth"],
        correct_answer: 0,
        sport: "mlb",
        difficulty: "hard",
        points: 15
      },
      {
        question_id: "q3",
        question: "Which NBA team has the most championships?",
        options: ["Lakers", "Celtics", "Warriors", "Bulls"],
        correct_answer: 1,
        sport: "nba",
        difficulty: "medium",
        points: 10
      }
    ];
    
    return questions[Math.floor(Math.random() * questions.length)];
  }

  function generateMockLeaderboard() {
    return [
      {
        rank: 1,
        user_id: "user_demo_1",
        username: "SportsFan_2024",
        total_points: 150,
        trivia_points: 120,
        prediction_points: 30,
        games_played: 15,
        accuracy: 0.85
      },
      {
        rank: 2,
        user_id: "user_demo_2",
        username: "MLB_Expert",
        total_points: 135,
        trivia_points: 100,
        prediction_points: 35,
        games_played: 12,
        accuracy: 0.78
      },
      {
        rank: 3,
        user_id: "user_demo_3",
        username: "NBA_Analyst",
        total_points: 120,
        trivia_points: 90,
        prediction_points: 30,
        games_played: 10,
        accuracy: 0.82
      },
      {
        rank: 4,
        user_id: "user_demo_4",
        username: "Trivia_Master",
        total_points: 110,
        trivia_points: 110,
        prediction_points: 0,
        games_played: 8,
        accuracy: 0.90
      },
      {
        rank: 5,
        user_id: "user_demo_5",
        username: "Prediction_Pro",
        total_points: 95,
        trivia_points: 45,
        prediction_points: 50,
        games_played: 7,
        accuracy: 0.75
      }
    ];
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Personalized Agents */}
        <div className="space-y-6">
          <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/20">
            <h2 className="text-2xl font-bold text-purple-300 mb-6">🤖 Create Personalized Agent</h2>
            
            <div className="space-y-4">
              <div className="text-sm">
                <span className="text-purple-400">User ID:</span>
                <span className="text-white ml-2 font-mono">{generatedUserId}</span>
              </div>
              
              <div>
                <label className="block text-purple-400 text-sm mb-1">Favorite Team</label>
                <select
                  value={favoriteTeam}
                  onChange={(e) => setFavoriteTeam(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-purple-500/30 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                >
                  <option value="">Select Team</option>
                  <option value="Yankees">Yankees</option>
                  <option value="Red Sox">Red Sox</option>
                  <option value="Dodgers">Dodgers</option>
                  <option value="Giants">Giants</option>
                  <option value="Astros">Astros</option>
                </select>
              </div>
              
              <div>
                <label className="block text-purple-400 text-sm mb-1">Agent Type</label>
                <select
                  value={personalizedAgentType}
                  onChange={(e) => setPersonalizedAgentType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-purple-500/30 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                >
                  <option value="team_agent">Team Agent</option>
                  <option value="custom_analyst">Custom Analyst</option>
                  <option value="personal_scout">Personal Scout</option>
                </select>
              </div>
              
              <button
                className="w-full px-4 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-md hover:from-purple-600 hover:to-pink-600 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={personalizedLoading || !favoriteTeam}
                onClick={createPersonalizedAgent}
              >
                {personalizedLoading ? "Creating Agent..." : "🤖 Create Personalized Agent"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Gamification */}
        <div className="space-y-6">
          <div className="bg-slate-800/50 rounded-xl p-6 border border-yellow-500/20">
            <h2 className="text-2xl font-bold text-yellow-300 mb-6">🎮 Gamification</h2>
            
            <div className="space-y-4">
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h4 className="text-yellow-300 font-medium mb-3">Your Score</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-yellow-400">{userScore.total_points}</div>
                    <div className="text-xs text-gray-400">Total Points</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-400">{userScore.trivia_points}</div>
                    <div className="text-xs text-gray-400">Trivia Points</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-400">{userScore.prediction_points}</div>
                    <div className="text-xs text-gray-400">Prediction Points</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  className="px-4 py-3 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold shadow-md hover:from-yellow-600 hover:to-orange-600 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={gamificationLoading}
                  onClick={getTriviaQuestion}
                >
                  {gamificationLoading ? "Loading..." : "🎯 Trivia"}
                </button>
                <button
                  className="px-4 py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold shadow-md hover:from-green-600 hover:to-emerald-600 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={gamificationLoading}
                  onClick={getLeaderboard}
                >
                  {gamificationLoading ? "Loading..." : "🏆 Leaderboard"}
                </button>
              </div>
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
                        <span className="text-white font-mono">{personalizedResult.agent_config.agent_id}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-purple-400">Agent Name:</span>
                        <span className="text-white">{personalizedResult.agent_config.agent_name}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-purple-400">Description:</span>
                        <span className="text-white">{personalizedResult.agent_config.description}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-purple-400">Favorite Team:</span>
                        <span className="text-white">{personalizedResult.agent_config.preferences?.favorite_team}</span>
                      </div>
                      
                      <div className="mt-4">
                        <h5 className="text-purple-300 font-medium mb-2">Capabilities:</h5>
                        <div className="space-y-1">
                          {personalizedResult.agent_config.capabilities?.map((capability: string, index: number) => (
                            <div key={index} className="flex items-center gap-2">
                              <span className="text-green-400">✓</span>
                              <span className="text-white text-sm">{capability}</span>
                            </div>
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
                        <span className="text-white">{personalizedResult.runtime_manifest.manifest_version}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-purple-400">Agent ID:</span>
                        <span className="text-white font-mono">{personalizedResult.runtime_manifest.agent_id}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-purple-400">Agent Name:</span>
                        <span className="text-white">{personalizedResult.runtime_manifest.agent_name}</span>
                      </div>
                      
                      <div className="mt-4">
                        <h5 className="text-purple-300 font-medium mb-2">Endpoints:</h5>
                        <div className="space-y-2">
                          {personalizedResult.runtime_manifest.endpoints?.map((endpoint: { path: string; method: string; description: string }, index: number) => (
                            <div key={index} className="bg-slate-700/50 rounded p-3">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-purple-400">Name:</span>
                                <span className="text-white">{endpoint.name}</span>
                              </div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-purple-400">URL:</span>
                                <span className="text-white font-mono">{endpoint.url}</span>
                              </div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-purple-400">Method:</span>
                                <span className="text-white">{endpoint.method}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-purple-400">Description:</span>
                                <span className="text-white">{endpoint.description}</span>
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

          {/* Gamification Results */}
          {showGamification && gamificationResult && (
            <div className="border border-yellow-500/20 rounded-xl p-4 bg-slate-900/70 text-slate-100 shadow-lg shadow-black/20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-yellow-300">
                  🎮 Gamification Results
                </h3>
                <button
                  onClick={() => setShowGamification(!showGamification)}
                  className="text-yellow-400 hover:text-yellow-300 text-sm"
                >
                  {showGamification ? "Hide" : "Show"}
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Trivia Question */}
                {currentQuestion && (
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <h4 className="text-yellow-300 font-medium mb-3">🎯 Trivia Question</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-yellow-400">Sport:</span>
                        <span className="text-white">{currentQuestion.sport?.toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-yellow-400">Difficulty:</span>
                        <span className="text-white capitalize">{currentQuestion.difficulty}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-yellow-400">Points:</span>
                        <span className="text-white">{currentQuestion.points}</span>
                      </div>
                      
                      <div className="mt-4">
                        <p className="text-white font-medium mb-3">{currentQuestion.question}</p>
                        <div className="space-y-2">
                          {currentQuestion.options?.map((option: string, index: number) => (
                            <label key={index} className="flex items-center gap-3 cursor-pointer">
                              <input
                                type="radio"
                                name="trivia-answer"
                                value={index}
                                checked={selectedAnswer === index}
                                onChange={() => setSelectedAnswer(index)}
                                className="w-4 h-4 text-yellow-500"
                              />
                              <span className="text-white">{option}</span>
                            </label>
                          ))}
                        </div>
                        
                        <button
                          className="w-full mt-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                          disabled={selectedAnswer === null || gamificationLoading}
                          onClick={submitTriviaAnswer}
                        >
                          {gamificationLoading ? "Submitting..." : "Submit Answer"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Answer Result */}
                {gamificationResult?.result && (
                  <div className={`rounded-lg p-4 ${gamificationResult.result.correct ? 'bg-green-900/20 border border-green-500/20' : 'bg-red-900/20 border border-red-500/20'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{gamificationResult.result.correct ? '✅' : '❌'}</span>
                      <h4 className={`font-medium ${gamificationResult.result.correct ? 'text-green-300' : 'text-red-300'}`}>
                        {gamificationResult.result.correct ? 'Correct!' : 'Incorrect!'}
                      </h4>
                    </div>
                    <p className="text-white text-sm mb-2">{gamificationResult.result.explanation}</p>
                    {gamificationResult.result.points_awarded > 0 && (
                      <p className="text-green-400 font-medium">+{gamificationResult.result.points_awarded} points!</p>
                    )}
                  </div>
                )}

                {/* Leaderboard */}
                {gamificationResult?.leaderboard && (
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <h4 className="text-yellow-300 font-medium mb-3">🏆 Leaderboard</h4>
                    <div className="space-y-2">
                      {gamificationResult.leaderboard.map((entry: { user_id: string; score: number }, index: number) => (
                        <div key={entry.user_id} className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                          <div className="flex items-center gap-3">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              index === 0 ? 'bg-yellow-500 text-black' :
                              index === 1 ? 'bg-gray-400 text-black' :
                              index === 2 ? 'bg-orange-600 text-white' :
                              'bg-slate-600 text-white'
                            }`}>
                              {entry.rank}
                            </span>
                            <span className="text-white font-medium">{entry.username}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-yellow-400 font-bold">{entry.total_points}</div>
                            <div className="text-xs text-gray-400">points</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}