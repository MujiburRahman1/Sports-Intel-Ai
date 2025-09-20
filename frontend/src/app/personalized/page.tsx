'use client';

import Link from 'next/link';
import { useState } from 'react';
import PersonalizedAgents from '../../components/PersonalizedAgents';

export default function PersonalizedPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            <Link href="/agents" className="hover:text-cyan-400 transition-colors">🤖 Agents</Link>
            <Link href="/voice" className="hover:text-cyan-400 transition-colors">Voice</Link>
            <Link href="/mistral" className="hover:text-cyan-400 transition-colors">🧠 Mistral AI</Link>
            <Link href="/wallet" className="hover:text-cyan-400 transition-colors">💰 Wallet</Link>
            <Link href="/personalized" className="text-cyan-400 font-medium">🤖 Personalized</Link>
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
              <Link href="/agents" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-cyan-400">🤖 Agents</Link>
              <Link href="/voice" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-cyan-400">Voice</Link>
              <Link href="/mistral" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-cyan-400">🧠 Mistral AI</Link>
              <Link href="/wallet" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-cyan-400">💰 Wallet</Link>
              <Link href="/personalized" onClick={() => setIsMobileMenuOpen(false)} className="text-cyan-400 font-medium">🤖 Personalized</Link>
              <a href="mailto:marwatstack@gmail.com" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-cyan-400">Contact</a>
            </div>
          </div>
        )}
      </nav>

      {/* Page Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            🤖 Personalized Agents
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Create your own personalized AI agents based on your favorite team. 
            Generate custom agent configurations and Coral runtime manifests for your specific needs.
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="text-xl font-semibold text-white mb-2">Team-Specific Agents</h3>
            <p className="text-gray-300">Create agents tailored to your favorite team with custom capabilities and data sources.</p>
          </div>
          
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
            <div className="text-3xl mb-3">🏆</div>
            <h3 className="text-xl font-semibold text-white mb-2">Gamification</h3>
            <p className="text-gray-300">Play trivia, make predictions, and compete on the leaderboard with other fans.</p>
          </div>
          
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
            <div className="text-3xl mb-3">⚙️</div>
            <h3 className="text-xl font-semibold text-white mb-2">Coral Integration</h3>
            <p className="text-gray-300">Generate Coral-compatible runtime manifests for seamless agent orchestration.</p>
          </div>
        </div>
      </div>

      {/* Personalized Agents Component */}
      <div className="container mx-auto px-4 pb-12">
        <PersonalizedAgents />
      </div>
      
      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-800/50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-400">
            <p>Built by <span className="text-cyan-400">Mujib ur Rahman</span></p>
          </div>
        </div>
      </footer>
    </div>
  );
}