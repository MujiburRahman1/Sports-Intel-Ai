"use client";

import { useState } from "react";
import Link from "next/link";
import MistralAgents from "../../components/MistralAgents";

export default function MistralPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen gradient-hero relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/5 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/5 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-700" />
      </div>
      {/* Navbar */}
      <nav className="relative z-10 container py-6 flex items-center justify-between">
        <Link href="/" className="text-white font-bold text-2xl">
          SportsIntel<span className="text-cyan-400">AI</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-gray-300">
          <Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link>
          <a href="#videos" className="hover:text-cyan-400 transition-colors">Videos</a>
          <a href="#dashboard" className="hover:text-cyan-400 transition-colors">Dashboard</a>
          <Link href="/voice" className="hover:text-cyan-400 transition-colors">Voice</Link>
          <Link href="/mistral" className="hover:text-cyan-400 transition-colors text-cyan-400">🧠 Mistral AI</Link>
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
      </nav>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden relative z-10 border-t border-blue-500/20 bg-slate-900/95">
          <div className="container py-4 flex flex-col gap-4">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-cyan-400">Home</Link>
            <a href="#videos" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-cyan-400">Videos</a>
            <a href="#dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-cyan-400">Dashboard</a>
            <Link href="/voice" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-cyan-400">Voice</Link>
            <Link href="/mistral" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-cyan-400 text-cyan-400">🧠 Mistral AI</Link>
            <Link href="/wallet" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-cyan-400">💰 Wallet</Link>
            <a href="mailto:marwatstack@gmail.com" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-cyan-400">Contact</a>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            🧠 <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Mistral AI</span>
          </h1>
          <p className="text-slate-300 text-xl max-w-3xl mx-auto">
            Advanced AI agents powered by Mistral's state-of-the-art language models. 
            Experience reasoning, code generation, multilingual translation, and NFT metadata creation.
          </p>
        </div>

        {/* Mistral Agents */}
        <div className="mb-12">
          <MistralAgents />
        </div>

        {/* Usage Guide */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Features Overview */}
          <div className="space-y-6">
            <div className="border border-purple-500/20 rounded-xl p-6 bg-slate-900/70 text-slate-100 shadow-lg shadow-black/20">
              <h3 className="font-semibold text-purple-300 mb-4">🧠 Advanced Reasoning Agent</h3>
              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Strategic analysis of team matchups and game scenarios</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Statistical insights with confidence scoring</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Betting intelligence and risk assessment</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Detailed reasoning process explanation</span>
                </div>
              </div>
            </div>

            <div className="border border-blue-500/20 rounded-xl p-6 bg-slate-900/70 text-slate-100 shadow-lg shadow-black/20">
              <h3 className="font-semibold text-blue-300 mb-4">💻 Codestral Code Generator</h3>
              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Sports analytics algorithms and data processing</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>NFT metadata generation for blockchain integration</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Betting calculator with probability formulas</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Multiple programming languages support</span>
                </div>
              </div>
            </div>
          </div>

          {/* More Features */}
          <div className="space-y-6">
            <div className="border border-green-500/20 rounded-xl p-6 bg-slate-900/70 text-slate-100 shadow-lg shadow-black/20">
              <h3 className="font-semibold text-green-300 mb-4">🌐 Multilingual Translation</h3>
              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">•</span>
                  <span>Real-time sports commentary translation</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">•</span>
                  <span>Cultural adaptation for different regions</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">•</span>
                  <span>Voice mode for conversational output</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">•</span>
                  <span>Support for 6+ major languages</span>
                </div>
              </div>
            </div>

            <div className="border border-orange-500/20 rounded-xl p-6 bg-slate-900/70 text-slate-100 shadow-lg shadow-black/20">
              <h3 className="font-semibold text-orange-300 mb-4">🎨 NFT Metadata Generator</h3>
              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <span className="text-orange-400 mt-1">•</span>
                  <span>Sports achievement badge creation</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-orange-400 mt-1">•</span>
                  <span>JSON-LD format following OpenSea standards</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-orange-400 mt-1">•</span>
                  <span>Rarity levels from Common to Legendary</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-orange-400 mt-1">•</span>
                  <span>AI image generation prompts included</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">📚 Usage Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-slate-600 rounded-xl p-6 bg-slate-800/50">
              <h3 className="font-semibold text-purple-300 mb-3">🧠 Reasoning Example</h3>
              <div className="text-sm text-slate-300 space-y-2">
                <p><strong>Input:</strong> Yankees vs Red Sox, "Who has the advantage?"</p>
                <p><strong>Output:</strong> Strategic analysis with statistical insights, betting recommendations, and confidence scoring.</p>
              </div>
            </div>

            <div className="border border-slate-600 rounded-xl p-6 bg-slate-800/50">
              <h3 className="font-semibold text-blue-300 mb-3">💻 Code Generation Example</h3>
              <div className="text-sm text-slate-300 space-y-2">
                <p><strong>Input:</strong> "Create a batting average calculator in Python"</p>
                <p><strong>Output:</strong> Complete Python code with error handling, documentation, and unit tests.</p>
              </div>
            </div>

            <div className="border border-slate-600 rounded-xl p-6 bg-slate-800/50">
              <h3 className="font-semibold text-green-300 mb-3">🌐 Translation Example</h3>
              <div className="text-sm text-slate-300 space-y-2">
                <p><strong>Input:</strong> "The Yankees are leading 3-1" → Spanish</p>
                <p><strong>Output:</strong> "Los Yankees van ganando 3-1" with cultural context.</p>
              </div>
            </div>

            <div className="border border-slate-600 rounded-xl p-6 bg-slate-800/50">
              <h3 className="font-semibold text-orange-300 mb-3">🎨 NFT Metadata Example</h3>
              <div className="text-sm text-slate-300 space-y-2">
                <p><strong>Input:</strong> Aaron Judge, Yankees, "50 home runs"</p>
                <p><strong>Output:</strong> Complete NFT metadata with attributes, story, and image prompts.</p>
              </div>
            </div>
          </div>
        </div>

        {/* API Integration Info */}
        <div className="mt-12 text-center">
          <div className="border border-purple-500/20 rounded-xl p-6 bg-slate-900/70 text-slate-100 shadow-lg shadow-black/20 max-w-4xl mx-auto">
            <h3 className="font-semibold text-purple-300 mb-4">🔗 Coral Protocol Integration</h3>
            <p className="text-slate-300 mb-4">
              All Mistral AI agents are fully integrated with Coral Protocol for seamless orchestration and discovery.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-purple-400 font-mono">mistral-reasoning</div>
                <div className="text-slate-400">Advanced Analysis</div>
              </div>
              <div className="text-center">
                <div className="text-blue-400 font-mono">mistral-codestral</div>
                <div className="text-slate-400">Code Generation</div>
              </div>
              <div className="text-center">
                <div className="text-green-400 font-mono">mistral-multilingual</div>
                <div className="text-slate-400">Translation</div>
              </div>
              <div className="text-center">
                <div className="text-orange-400 font-mono">mistral-nft-metadata</div>
                <div className="text-slate-400">NFT Creation</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/80 border-t border-slate-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-slate-400">
            <p>© {new Date().getFullYear()} Mujib ur Rahman • All Rights Reserved</p>
            <p className="mt-2">
              Built for the Internet of Agents Hackathon • Powered by Mistral AI
            </p>
            <div className="mt-4 flex justify-center space-x-6">
              <a href="mailto:marwatstack@gmail.com" className="text-slate-400 hover:text-white transition-colors">
                Contact
              </a>
              <Link href="/#dashboard" className="text-slate-400 hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link href="/voice" className="text-slate-400 hover:text-white transition-colors">
                Voice Chat
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
