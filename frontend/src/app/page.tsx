'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/5 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/5 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      {/* Navbar */}
      <nav className="border-b border-slate-700/50 bg-slate-900/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-white font-bold text-2xl">
          SportsIntel<span className="text-cyan-400">AI</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-gray-300">
          <Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link>
          <a href="#videos" className="hover:text-cyan-400 transition-colors">Videos</a>
          <Link href="/agents" className="hover:text-cyan-400 transition-colors">🤖 Agents</Link>
          <Link href="/voice" className="hover:text-cyan-400 transition-colors">Voice</Link>
          <Link href="/mistral" className="hover:text-cyan-400 transition-colors">🧠 Mistral AI</Link>
          <Link href="/personalized" className="hover:text-cyan-400 transition-colors">🤖 Personalized</Link>
          <Link href="/wallet" className="hover:text-cyan-400 transition-colors">💰 Wallet</Link>
          <a href="mailto:marwatstack@gmail.com" className="hover:text-cyan-400 transition-colors">Contact</a>
        </div>
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
            <Link href="/agents" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-cyan-400">🤖 Agents</Link>
            <Link href="/voice" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-cyan-400">Voice</Link>
            <Link href="/mistral" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-cyan-400">🧠 Mistral AI</Link>
            <Link href="/personalized" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-cyan-400">🤖 Personalized</Link>
            <Link href="/wallet" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-cyan-400">💰 Wallet</Link>
            <a href="mailto:marwatstack@gmail.com" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-cyan-400">Contact</a>
          </div>
        </div>
      )}

      {/* Hero */}
      <header className="relative z-10 container pt-12 pb-10 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight">
          MLB Analyst & Betting Assistant
        </h1>
        <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
          Real-time voice agent powered by ElevenLabs (GPT-5) with a FastAPI tools backend (schedule, stats, news, YouTube) behind Netlify Functions. Concise scouting plus clear betting leans.
        </p>
        <p className="mt-3 text-cyan-300 font-semibold">Built by Mujib ur Rahman</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/voice" className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all">Try Voice Demo</Link>
          <a href="#videos" className="px-8 py-4 rounded-full border-2 border-cyan-400 text-cyan-400 font-semibold hover:bg-cyan-400 hover:text-white transition-all">Watch Videos</a>
        </div>
      </header>

      {/* Videos Section */}
      <section id="videos" className="relative z-10 container py-14">
        <h2 className="text-3xl font-bold text-white text-center mb-10">Videos</h2>
        <div className="grid md:grid-cols-2 gap-8 justify-items-center">
          <div className="card p-4 w-full max-w-3xl">
            <h3 className="text-lg font-semibold text-cyan-300 mb-3 text-center">Product Demo (≤60s)</h3>
            <div className="aspect-video rounded-xl overflow-hidden">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/H-z0v4WMSco"
                title="Demo Video"
                frameBorder={0}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
          <div className="card p-4 w-full max-w-3xl">
            <h3 className="text-lg font-semibold text-cyan-300 mb-3 text-center">Tech Overview (≤60s)</h3>
            <div className="aspect-video rounded-xl overflow-hidden">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/knhhYob-y-Q"
                title="Tech Video"
                frameBorder={0}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
        <div className="text-center mt-8">
          <Link href="/voice" className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all">Go to Voice Demo</Link>
        </div>
      </section>

      {/* Architecture Section */}
      <section id="architecture" className="relative z-10 container py-14">
        <h2 className="text-3xl font-bold text-white text-center mb-10">Architecture</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-cyan-300 mb-2">Stack</h3>
            <ul className="text-gray-300 list-disc list-inside space-y-1">
              <li>Next.js + Tailwind UI at <code>/voice</code></li>
              <li>ElevenLabs Agent (GPT‑5) real‑time voice</li>
              <li>Netlify Functions: tool proxy + WS broker</li>
              <li>FastAPI backend: schedule, stats, news, YouTube</li>
            </ul>
          </div>
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-cyan-300 mb-2">Data & Tools</h3>
            <ul className="text-gray-300 list-disc list-inside space-y-1">
              <li>MLB stats APIs for schedule & team metrics</li>
              <li>NewsAPI for injuries and roster updates</li>
              <li>YouTube search for recent analysis content</li>
              <li>Team intelligence aggregator endpoint</li>
            </ul>
          </div>
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-cyan-300 mb-2">Security</h3>
            <ul className="text-gray-300 list-disc list-inside space-y-1">
              <li>Token‑secured tool calls via Functions</li>
              <li>Secrets in env: ELEVEN_API_KEY, TOOL_TOKEN, NEWS_API_KEY</li>
              <li>Backend URL hidden behind the proxy</li>
              <li>UTC‑safe scheduling and pinned deps</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-blue-500/20">
        <div className="container py-8 text-sm text-gray-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Mujib ur Rahman • All Rights Reserved</p>
          <div className="flex gap-4">
            <a className="hover:text-cyan-300" href="/voice">Voice</a>
            <a className="hover:text-cyan-300" href="mailto:marwatstack@gmail.com">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
