'use client';

import Link from 'next/link';
import { useState } from 'react';
import DashboardEmbed from '../../components/DashboardEmbed';

export default function AgentsPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCommunityAgents, setShowCommunityAgents] = useState(false);
  const [externalAgentUrl, setExternalAgentUrl] = useState('');
  const [communityAgents, setCommunityAgents] = useState<Array<{
    id: string;
    name: string;
    description: string;
    source: string;
    added_at: string;
  }>>([]);
  const [communityLoading, setCommunityLoading] = useState(false);
  const [communityError, setCommunityError] = useState('');

  const addExternalAgent = async () => {
    if (!externalAgentUrl.trim()) {
      setCommunityError('Please enter a manifest URL');
      return;
    }

    setCommunityLoading(true);
    setCommunityError('');

    try {
      // Try to fetch the manifest
      const response = await fetch(externalAgentUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const manifest = await response.json();
      
      if (!manifest.manifest || !manifest.manifest.agents) {
        throw new Error('Invalid manifest format');
      }

      // Add agents to the list
      const newAgents = manifest.manifest.agents.map((agent: {
        id: string;
        name: string;
        description: string;
      }) => ({
        ...agent,
        manifestUrl: externalAgentUrl,
        id: `${agent.id}-${Date.now()}`, // Make unique
        enabled: true
      }));

      setCommunityAgents(prev => [...prev, ...newAgents]);
      setExternalAgentUrl('');
      
    } catch (error) {
      console.error('Error adding external agent:', error);
      setCommunityError(`Failed to add agent: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setCommunityLoading(false);
    }
  };

  const removeCommunityAgent = (agentId: string) => {
    setCommunityAgents(prev => prev.filter(agent => agent.id !== agentId));
  };

  const toggleCommunityAgent = (agentId: string) => {
    setCommunityAgents(prev => 
      prev.map(agent => 
        agent.id === agentId ? { ...agent, enabled: !agent.enabled } : agent
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navbar */}
      <nav className="border-b border-slate-700/50 bg-slate-900/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-white font-bold text-2xl">
            SportsIntel<span className="text-cyan-400">AI</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-gray-300">
            <Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link>
            <Link href="/#videos" className="hover:text-cyan-400 transition-colors">Videos</Link>
            <Link href="/agents" className="text-cyan-400 font-medium">🤖 Agents</Link>
            <Link href="/voice" className="hover:text-cyan-400 transition-colors">Voice</Link>
            <Link href="/mistral" className="hover:text-cyan-400 transition-colors">🧠 Mistral AI</Link>
            <Link href="/personalized" className="hover:text-cyan-400 transition-colors">🤖 Personalized</Link>
            <Link href="/wallet" className="hover:text-cyan-400 transition-colors">💰 Wallet</Link>
            <a href="mailto:marwatstack@gmail.com" className="hover:text-cyan-400 transition-colors">Contact</a>
          </div>
          
          <button
            aria-label="Toggle mobile menu"
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(v => !v)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-700/50 bg-slate-900/95">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-cyan-400">Home</Link>
              <Link href="/#videos" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-cyan-400">Videos</Link>
              <Link href="/agents" onClick={() => setIsMobileMenuOpen(false)} className="text-cyan-400 font-medium">🤖 Agents</Link>
              <Link href="/voice" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-cyan-400">Voice</Link>
              <Link href="/mistral" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-cyan-400">🧠 Mistral AI</Link>
              <Link href="/personalized" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-cyan-400">🤖 Personalized</Link>
              <Link href="/wallet" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-cyan-400">💰 Wallet</Link>
              <a href="mailto:marwatstack@gmail.com" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-cyan-400">Contact</a>
            </div>
          </div>
        )}
      </nav>

      {/* Page Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              🤖 Multi-Agent Dashboard
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl">
              Orchestrate multiple AI agents for comprehensive sports analysis. Run individual agents, 
              execute full pipelines, and analyze fan sentiment - all powered by Coral Protocol.
            </p>
          </div>
          
          {/* Community Agents Button */}
          <div className="ml-8">
            <button
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
              onClick={() => setShowCommunityAgents(!showCommunityAgents)}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🌐</span>
                <div className="text-left">
                  <div className="text-lg font-bold">
                    {showCommunityAgents ? "Hide" : "Show"} Community Agents
                  </div>
                  <div className="text-sm opacity-90">
                    {showCommunityAgents ? "Click to hide" : "Click to show"}
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Community Agents Full Page */}
      {showCommunityAgents ? (
        <div className="min-h-screen bg-slate-900">
          {/* Community Agents Header */}
          <div className="text-center py-16">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-6">
                <span className="text-3xl">🌐</span>
              </div>
              <h1 className="text-5xl font-bold text-white">Community Agents</h1>
            </div>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Discover and integrate external AI agents from the Coral Protocol ecosystem. 
              Add community-created agents to expand your analysis capabilities and access specialized tools.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="container mx-auto px-4 mb-16">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Add External Agents Card */}
              <div className="bg-gradient-to-br from-purple-900/30 to-slate-800/50 border border-purple-500/20 rounded-xl p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">🔗</span>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">Add External Agents</h3>
                <p className="text-gray-300 leading-relaxed">
                  Paste Coral manifest URLs to discover and add community-created agents to your dashboard.
                </p>
              </div>

              {/* Agent Management Card */}
              <div className="bg-gradient-to-br from-blue-900/30 to-slate-800/50 border border-blue-500/20 rounded-xl p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">⚙️</span>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">Agent Management</h3>
                <p className="text-gray-300 leading-relaxed">
                  Select, organize, and manage your community agents with easy-to-use controls and settings.
                </p>
              </div>

              {/* Ecosystem Integration Card */}
              <div className="bg-gradient-to-br from-green-900/30 to-slate-800/50 border border-green-500/20 rounded-xl p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">🚀</span>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">Ecosystem Integration</h3>
                <p className="text-gray-300 leading-relaxed">
                  Run community agents alongside built-in agents for comprehensive analysis and insights.
                </p>
              </div>
            </div>
          </div>

          {/* Community Agents Management */}
          <div className="container mx-auto px-4 pb-16">
            <div className="border border-purple-500/20 rounded-xl p-8 bg-slate-900/70 text-slate-100 shadow-lg shadow-black/20">
              <div className="space-y-8">
                {/* Add External Agent */}
                <div className="bg-slate-800/50 rounded-lg p-8">
                  <h4 className="text-purple-300 font-medium mb-6 text-xl">Add External Agent</h4>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-white mb-3">Coral Manifest URL</label>
                      <div className="flex gap-4">
                        <input 
                          className="flex-1 border border-purple-500/30 rounded-lg p-4 bg-slate-700 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400 transition-all text-lg" 
                          placeholder="https://example.com/coral-manifest.json"
                          value={externalAgentUrl}
                          onChange={(e) => setExternalAgentUrl(e.target.value)}
                        />
                        <button
                          className="px-10 py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/25 text-lg"
                          onClick={addExternalAgent}
                          disabled={communityLoading}
                        >
                          {communityLoading ? 'Adding...' : 'Add Agent'}
                        </button>
                      </div>
                      <p className="text-sm text-gray-400 mt-4">
                        Paste a Coral manifest URL to discover and add external agents to your dashboard
                      </p>
                      
                      {/* Error Display */}
                      {communityError && (
                        <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                          <p className="text-red-300 text-sm">{communityError}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <div className="text-sm text-gray-400 mb-2">Try these sample manifests:</div>
                      <div className="flex flex-wrap gap-4">
                        <button 
                          className="px-4 py-2 bg-purple-600/20 border border-purple-500/30 rounded-lg text-purple-300 hover:bg-purple-600/30 hover:border-purple-400/50 transition-all text-sm"
                          onClick={() => {
                            const input = document.querySelector('input[placeholder*="coral-manifest"]') as HTMLInputElement;
                            if (input) {
                              input.value = '/sample-external-agents.json';
                            }
                          }}
                        >
                          🌐 General Agents
                        </button>
                        <button 
                          className="px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-300 hover:bg-blue-600/30 hover:border-blue-400/50 transition-all text-sm"
                          onClick={() => {
                            const input = document.querySelector('input[placeholder*="coral-manifest"]') as HTMLInputElement;
                            if (input) {
                              input.value = '/sports-analytics-agents.json';
                            }
                          }}
                        >
                          ⚾ Sports Analytics
                        </button>
                        <button 
                          className="px-4 py-2 bg-green-600/20 border border-green-500/30 rounded-lg text-green-300 hover:bg-green-600/30 hover:border-green-400/50 transition-all text-sm"
                          onClick={() => {
                            const input = document.querySelector('input[placeholder*="coral-manifest"]') as HTMLInputElement;
                            if (input) {
                              input.value = '/sample-coral-manifest.json';
                            }
                          }}
                        >
                          🎯 Basic Example
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Instructions */}
                <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-lg p-8">
                  <h4 className="text-blue-300 font-medium mb-6 text-xl">How to Use Community Agents</h4>
                  <div className="text-gray-300 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                      <p className="text-lg">Find a Coral manifest URL (JSON file describing agents)</p>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                      <p className="text-lg">Paste the URL in the input field above</p>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                      <p className="text-lg">Click "Add Agent" to discover and add agents</p>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">4</div>
                      <p className="text-lg">Check/uncheck agents to include them in your runs</p>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">5</div>
                      <p className="text-lg">Run agents normally - community agents will be included</p>
                    </div>
                  </div>
                </div>
                
                {/* Community Agents List */}
                {communityAgents.length > 0 && (
                  <div className="bg-slate-800/50 rounded-lg p-8">
                    <h4 className="text-purple-300 font-medium mb-6 text-xl">Added Community Agents</h4>
                    <div className="space-y-4">
                      {communityAgents.map((agent) => (
                        <div key={agent.id} className="bg-slate-700/50 rounded-lg p-4 border border-purple-500/20">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <input
                                type="checkbox"
                                checked={agent.enabled}
                                onChange={() => toggleCommunityAgent(agent.id)}
                                className="w-5 h-5 text-purple-600 bg-slate-700 border-purple-500 rounded focus:ring-purple-500 focus:ring-2"
                              />
                              <div>
                                <h5 className="text-white font-medium text-lg">{agent.name}</h5>
                                <p className="text-gray-300 text-sm">{agent.description}</p>
                                <p className="text-purple-400 text-xs mt-1">ID: {agent.id}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => removeCommunityAgent(agent.id)}
                              className="px-4 py-2 bg-red-600/20 border border-red-500/30 rounded-lg text-red-300 hover:bg-red-600/30 hover:border-red-400/50 transition-all text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/20 rounded-lg">
                      <p className="text-blue-300 text-sm">
                        <strong>Total Agents:</strong> {communityAgents.length} | 
                        <strong> Enabled:</strong> {communityAgents.filter(a => a.enabled).length} | 
                        <strong> Disabled:</strong> {communityAgents.filter(a => !a.enabled).length}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Features Grid */}
          <div className="container mx-auto px-4 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="text-xl font-semibold text-white mb-2">Individual Agents</h3>
                <p className="text-gray-300">Run specific agents for stats, news, YouTube analysis, and more.</p>
              </div>
              
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                <div className="text-3xl mb-3">🚀</div>
                <h3 className="text-xl font-semibold text-white mb-2">Pipeline Execution</h3>
                <p className="text-gray-300">Chain multiple agents together for comprehensive team analysis.</p>
              </div>
              
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="text-xl font-semibold text-white mb-2">Fan Sentiment</h3>
                <p className="text-gray-300">Analyze social media sentiment and fan reactions in real-time.</p>
              </div>
            </div>
          </div>

          {/* Dashboard Component */}
          <div className="container mx-auto px-4 pb-12">
            <DashboardEmbed />
          </div>
        </>
      )}
      
      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-800/50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-400">
            <p>Built by <span className="text-cyan-400">Mujib ur Rahman</span></p>
            <p className="mt-2">
              <a href="mailto:marwatstack@gmail.com" className="hover:text-cyan-400 transition-colors">
                marwatstack@gmail.com
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
