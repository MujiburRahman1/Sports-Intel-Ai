"use client";

import { useState } from "react";

export default function MistralAgents() {
  const [activeTab, setActiveTab] = useState("reasoning");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // MLB Teams List
  const mlbTeams = [
    "Yankees", "Red Sox", "Blue Jays", "Rays", "Orioles",
    "Astros", "Angels", "Mariners", "Athletics", "Rangers",
    "Twins", "Guardians", "Tigers", "White Sox", "Royals",
    "Braves", "Mets", "Phillies", "Marlins", "Nationals",
    "Dodgers", "Padres", "Giants", "Diamondbacks", "Rockies",
    "Brewers", "Cubs", "Cardinals", "Pirates", "Reds"
  ];

  // Reasoning Agent State
  const [reasoningData, setReasoningData] = useState({
    team1: "Yankees",
    team2: "Red Sox",
    context: "Game analysis",
    question: "Who has the advantage?"
  });

  // Codestral Agent State
  const [codestralData, setCodestralData] = useState({
    type: "sports_analytics",
    language: "Python",
    requirements: "Create a batting average calculator",
    context: "MLB statistics"
  });

  // Multilingual Agent State
  const [multilingualData, setMultilingualData] = useState({
    text: "The Yankees are leading 3-1 in the 7th inning",
    target_language: "Spanish",
    context: "Game commentary",
    voice_mode: false
  });

  // NFT Metadata Agent State
  const [nftData, setNftData] = useState({
    player_name: "Aaron Judge",
    team: "Yankees",
    achievement: "50 home runs in a season",
    rarity: "Legendary",
    language: "English"
  });

  const callAgent = async (agentType: string, data: any) => {
    setLoading(true);
    setError(null);
    setResult("");

    try {
      // Call Mistral API directly from frontend
      const mistralApiKey = "1ICn8Kurla8DcvfoQfA1QzeBZr6BZfix"; // Direct API key
      
      if (!mistralApiKey) {
        throw new Error("Mistral API key not configured");
      }

      let prompt = "";
      let model = "mistral-large-latest";

      // Create prompts based on agent type
      if (agentType === "reasoning") {
        prompt = `You are an expert MLB analyst. Analyze the matchup between ${data.team1} and ${data.team2}.
        
Context: ${data.context || "General analysis requested"}
Question: ${data.question || "Provide comprehensive analysis"}

Provide detailed insights including:
- Team strengths and weaknesses
- Key players to watch
- Historical matchup data
- Betting considerations
- Weather/venue factors

Format your response as a comprehensive analysis.`;
      } else if (agentType === "codestral") {
        model = "codestral-latest";
        prompt = `Generate ${data.language} code for ${data.type} with the following requirements:
- ${data.requirements}
- Context: ${data.context || "General code generation"}
- Include proper error handling and documentation
- Use modern best practices

Provide clean, production-ready code.`;
      } else if (agentType === "multilingual") {
        prompt = `Translate the following text to ${data.target_language}:
"${data.text}"

Context: ${data.context || "Sports commentary"}
Voice Mode: ${data.voice_mode ? "Adapt for conversational speech" : "Use formal style"}

Provide accurate translation maintaining sports terminology and context.`;
      } else if (agentType === "nft-metadata") {
        prompt = `Generate NFT metadata for a baseball achievement badge:

Player: ${data.player_name}
Team: ${data.team}
Achievement: ${data.achievement}
Rarity: ${data.rarity}

Create comprehensive metadata including name, description, attributes, and story. Format as JSON.`;
      }

      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${mistralApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert AI assistant specialized in sports analysis, code generation, translation, and NFT metadata creation.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 2000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`Mistral API error: ${response.status}`);
      }

      const result = await response.json();
      let realResult = result.choices[0]?.message?.content || 'No result generated';
      
      // Clean up the output - remove markdown formatting except code blocks
      if (agentType !== "codestral") {
        realResult = realResult
          .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
          .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
          .replace(/^[-•]\s+/gm, '• ') // Clean list items
          .replace(/^\d+\.\s+/gm, '• ') // Convert numbered lists to bullet points
          .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove markdown links
          .replace(/`(.*?)`/g, '$1') // Remove inline code formatting (except code blocks)
          .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
          .trim();
      }
      
      setResult(`${realResult}\n\n(Real Data - Mistral AI Generated)`);
    } catch (error) {
      console.error(`${agentType} agent error:`, error);
      
      // Show error message with fallback to mock data
      if (error instanceof Error) {
        if (error.message.includes("429")) {
          setError("Mistral API rate limit exceeded. Using demo data instead.");
          const mockResponse = getMockResponse(agentType, data);
          setResult(mockResponse);
        } else if (error.message.includes("401")) {
          setError("Mistral API key invalid. Using demo data instead.");
          const mockResponse = getMockResponse(agentType, data);
          setResult(mockResponse);
        } else {
          setError(`Mistral API error: ${error.message}. Using demo data instead.`);
          const mockResponse = getMockResponse(agentType, data);
          setResult(mockResponse);
        }
      } else {
        setError("Failed to connect to Mistral API. Using demo data instead.");
        const mockResponse = getMockResponse(agentType, data);
        setResult(mockResponse);
      }
    } finally {
      setLoading(false);
    }
  };

  const getMockResponse = (agentType: string, data: any) => {
    if (agentType === "reasoning") {
        return `Advanced Analysis for ${data.team1} vs ${data.team2}

Strategic Analysis
${data.team1} shows strong offensive capabilities with recent momentum. ${data.team2} has solid defensive structure and home field advantage. Key matchup factors include pitching rotation, bullpen depth, and recent form.

Statistical Insights
Head-to-head record shows ${data.team1} leads 3-2 in last 5 meetings. Recent performance trends favor ${data.team1} in away games. Weather conditions may impact game strategy.

Betting Intelligence
Recommended bet is ${data.team1} ML with 65% confidence. Risk level is Medium due to weather dependency. Value bet is Over 8.5 runs with current line movement.

Reasoning Process
Analysis based on recent form, head-to-head data, and situational factors. Confidence level: 7/10

(Demo Mode - Mock Data)`;
    }

    if (agentType === "codestral") {
        return `# ${data.type.replace('_', ' ').toUpperCase()} - ${data.language}

\`\`\`${data.language.toLowerCase()}
# ${data.requirements}
import pandas as pd
import numpy as np
from typing import Dict, List, Optional

class SportsAnalytics:
    def __init__(self):
        self.data = {}
    
    def calculate_batting_average(self, hits: int, at_bats: int) -> float:
        """Calculate batting average with error handling"""
        if at_bats <= 0:
            raise ValueError("At bats must be greater than 0")
        return round(hits / at_bats, 3)
    
    def analyze_performance(self, player_data: Dict) -> Dict:
        """Analyze player performance metrics"""
        avg = self.calculate_batting_average(
            player_data.get('hits', 0), 
            player_data.get('at_bats', 1)
        )
        
        return {
            'batting_average': avg,
            'performance_level': 'Excellent' if avg > 0.300 else 'Good' if avg > 0.250 else 'Average',
            'recommendations': self.get_recommendations(avg)
        }
    
    def get_recommendations(self, avg: float) -> List[str]:
        """Get performance recommendations"""
        if avg > 0.300:
            return ["Maintain current approach", "Consider leadership role"]
        elif avg > 0.250:
            return ["Focus on consistency", "Work on plate discipline"]
        else:
            return ["Intensive batting practice", "Video analysis recommended"]

# Example usage
if __name__ == "__main__":
    analytics = SportsAnalytics()
    
    # Test data
    player = {'hits': 45, 'at_bats': 150}
    result = analytics.analyze_performance(player)
    print(f"Batting Average: {result['batting_average']}")
    print(f"Performance: {result['performance_level']}")
\`\`\`

**Features:**
- Error handling for edge cases
- Type hints for better code quality
- Comprehensive documentation
- Unit testing examples included
- Modular design for easy extension

(Demo Mode - Mock Data)`;
    }

    if (agentType === "multilingual") {
        const translations = {
          "Spanish": "Los Yankees van ganando 3-1 en la séptima entrada",
          "French": "Les Yankees mènent 3-1 en septième manche",
          "German": "Die Yankees führen 3-1 in der siebten Inning",
          "Chinese": "洋基队在第七局以3-1领先",
          "Japanese": "ヤンキースは7回に3-1でリードしています",
          "Arabic": "الينكيز يتقدمون 3-1 في الشوط السابع"
        };
        
        return `Translation Result

Original Text: ${data.text}
Target Language: ${data.target_language}
Voice Mode: ${data.voice_mode ? 'Enabled conversational' : 'Disabled formal'}

Translation
${translations[data.target_language as keyof typeof translations] || "Translation not available for this language"}

Cultural Context
${data.voice_mode ? 'Adapted for conversational speech with natural flow' : 'Formal sports commentary style maintained'}

Usage Notes
Maintains sports terminology accuracy. Preserves game context and excitement. Suitable for ${data.voice_mode ? 'live commentary' : 'written reports'}

(Demo Mode - Mock Data)`;
    }

    if (agentType === "nft-metadata") {
        const playerName = data.player_name || "Player";
        const team = data.team || "Team";
        const achievement = data.achievement || "Achievement";
        const rarity = data.rarity || "Rare";
        
        return `NFT Metadata Generated (Note: This creates metadata only, not actual NFT)

Player Achievement Badge: ${playerName} - ${achievement}
Team: ${team}
Rarity Level: ${rarity}

Metadata JSON
{
  "name": "${playerName} - ${achievement}",
  "description": "${playerName} of the ${team} achieved ${achievement}, marking a historic moment in baseball history. This legendary accomplishment showcases exceptional skill and dedication to the sport.",
  "image": "https://example.com/nft-images/${playerName.toLowerCase().replace(' ', '-')}-${achievement.toLowerCase().replace(' ', '-')}.jpg",
  "attributes": [
    {"trait_type": "Player", "value": "${playerName}"},
    {"trait_type": "Team", "value": "${team}"},
    {"trait_type": "Achievement", "value": "${achievement}"},
    {"trait_type": "Rarity", "value": "${rarity}"},
    {"trait_type": "Sport", "value": "Baseball"},
    {"trait_type": "Season", "value": "2024"}
  ],
  "story": "In a remarkable display of power and precision, ${playerName} delivered one of the most memorable performances in ${team} history. This achievement not only cements their legacy but also inspires future generations of baseball players.",
  "image_prompt": "Professional baseball player ${playerName} in ${team} uniform celebrating ${achievement}, dramatic lighting, stadium background, trophy or milestone marker visible, high-quality sports photography style"
}

What This Metadata Does
This metadata file describes what the NFT would contain if you mint it on a blockchain. It includes player information, achievement details, rarity level, and image description. To create actual NFT, you would need to use platforms like OpenSea, Rarible, or Crossmint with this metadata.

Next Steps to Create Real NFT
• Use the image_prompt to generate artwork with AI (DALL-E, Midjourney)
• Upload image to IPFS or cloud storage
• Update image URL in metadata
• Use NFT minting platform (Crossmint, OpenSea) to create actual NFT
• Pay gas fees and mint the NFT on blockchain

This metadata is ready to use with any NFT marketplace or minting platform.

(Demo Mode - Mock Data)`;
    }

    // Fallback for any other agent types
    return `${agentType} agent executed successfully with mock data.`;
  };

  return (
    <div className="border border-purple-500/20 rounded-xl p-6 bg-slate-900/70 text-slate-100 shadow-lg shadow-black/20">
      <h3 className="font-semibold text-purple-300 mb-4">🧠 Mistral AI Agents</h3>
      
      {/* Tab Navigation */}
      <div className="flex gap-2 mb-4">
        {[
          { id: "reasoning", label: "🧠 Reasoning", icon: "🧠" },
          { id: "codestral", label: "💻 Code Gen", icon: "💻" },
          { id: "multilingual", label: "🌐 Translate", icon: "🌐" },
          { id: "nft-metadata", label: "🎨 NFT Meta", icon: "🎨" }
        ].map((tab) => (
          <button
            key={tab.id}
            className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-purple-600 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reasoning Agent */}
      {activeTab === "reasoning" && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-white mb-1">Team 1</label>
              <select
                className="w-full border rounded p-2 bg-white text-black"
                value={reasoningData.team1}
                onChange={(e) => setReasoningData(prev => ({ ...prev, team1: e.target.value }))}
              >
                {mlbTeams.map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Team 2</label>
              <select
                className="w-full border rounded p-2 bg-white text-black"
                value={reasoningData.team2}
                onChange={(e) => setReasoningData(prev => ({ ...prev, team2: e.target.value }))}
              >
                {mlbTeams.map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">Context</label>
            <input
              className="w-full border rounded p-2 bg-white text-black"
              value={reasoningData.context}
              onChange={(e) => setReasoningData(prev => ({ ...prev, context: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">Question</label>
            <input
              className="w-full border rounded p-2 bg-white text-black"
              value={reasoningData.question}
              onChange={(e) => setReasoningData(prev => ({ ...prev, question: e.target.value }))}
            />
          </div>
          <button
            className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
            onClick={() => callAgent("reasoning", reasoningData)}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "🧠 Get Advanced Analysis"}
          </button>
        </div>
      )}

      {/* Codestral Agent */}
      {activeTab === "codestral" && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-white mb-1">Code Type</label>
            <select
              className="w-full border rounded p-2 bg-white text-black"
              value={codestralData.type}
              onChange={(e) => setCodestralData(prev => ({ ...prev, type: e.target.value }))}
            >
              <option value="sports_analytics">Sports Analytics</option>
              <option value="nft_metadata">NFT Metadata</option>
              <option value="betting_calculator">Betting Calculator</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">Language</label>
            <select
              className="w-full border rounded p-2 bg-white text-black"
              value={codestralData.language}
              onChange={(e) => setCodestralData(prev => ({ ...prev, language: e.target.value }))}
            >
              <option value="Python">Python</option>
              <option value="JavaScript">JavaScript</option>
              <option value="TypeScript">TypeScript</option>
              <option value="Solidity">Solidity</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">Requirements</label>
            <textarea
              className="w-full border rounded p-2 bg-white text-black h-20"
              value={codestralData.requirements}
              onChange={(e) => setCodestralData(prev => ({ ...prev, requirements: e.target.value }))}
            />
          </div>
          <button
            className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
            onClick={() => callAgent("codestral", codestralData)}
            disabled={loading}
          >
            {loading ? "Generating..." : "💻 Generate Code"}
          </button>
        </div>
      )}

      {/* Multilingual Agent */}
      {activeTab === "multilingual" && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-white mb-1">Text to Translate</label>
            <textarea
              className="w-full border rounded p-2 bg-white text-black h-20"
              value={multilingualData.text}
              onChange={(e) => setMultilingualData(prev => ({ ...prev, text: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">Target Language</label>
            <select
              className="w-full border rounded p-2 bg-white text-black"
              value={multilingualData.target_language}
              onChange={(e) => setMultilingualData(prev => ({ ...prev, target_language: e.target.value }))}
            >
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Chinese">Chinese</option>
              <option value="Japanese">Japanese</option>
              <option value="Arabic">Arabic</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="voice-mode"
              checked={multilingualData.voice_mode}
              onChange={(e) => setMultilingualData(prev => ({ ...prev, voice_mode: e.target.checked }))}
            />
            <label htmlFor="voice-mode" className="text-sm text-white">Voice Mode (for speaking aloud - more natural)</label>
          </div>
          <button
            className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
            onClick={() => callAgent("multilingual", multilingualData)}
            disabled={loading}
          >
            {loading ? "Translating..." : "🌐 Translate"}
          </button>
        </div>
      )}

      {/* NFT Metadata Agent */}
      {activeTab === "nft-metadata" && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-white mb-1">Player Name</label>
              <input
                className="w-full border rounded p-2 bg-white text-black"
                value={nftData.player_name}
                onChange={(e) => setNftData(prev => ({ ...prev, player_name: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Team</label>
              <select
                className="w-full border rounded p-2 bg-white text-black"
                value={nftData.team}
                onChange={(e) => setNftData(prev => ({ ...prev, team: e.target.value }))}
              >
                {mlbTeams.map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">Achievement</label>
            <input
              className="w-full border rounded p-2 bg-white text-black"
              value={nftData.achievement}
              onChange={(e) => setNftData(prev => ({ ...prev, achievement: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">Rarity</label>
            <select
              className="w-full border rounded p-2 bg-white text-black"
              value={nftData.rarity}
              onChange={(e) => setNftData(prev => ({ ...prev, rarity: e.target.value }))}
            >
              <option value="Common">Common</option>
              <option value="Rare">Rare</option>
              <option value="Epic">Epic</option>
              <option value="Legendary">Legendary</option>
            </select>
          </div>
          <button
            className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
            onClick={() => callAgent("nft-metadata", nftData)}
            disabled={loading}
          >
            {loading ? "Generating..." : "🎨 Generate NFT Metadata"}
          </button>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="mt-4 p-3 bg-slate-800 rounded">
          <h4 className="text-sm font-medium text-purple-300 mb-2">Result:</h4>
          <pre className="text-xs text-slate-300 whitespace-pre-wrap overflow-x-auto">
            {result}
          </pre>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-900/30 rounded">
          <p className="text-sm text-red-400">❌ {error}</p>
        </div>
      )}
    </div>
  );
}
