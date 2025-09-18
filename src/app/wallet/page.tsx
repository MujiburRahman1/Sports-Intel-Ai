"use client";

import { useState } from "react";
import Link from "next/link";
import CrossmintWallet from "../../components/CrossmintWallet";

export default function WalletPage() {
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
          <a href="/#videos" className="hover:text-cyan-400 transition-colors">Videos</a>
          <a href="/#dashboard" className="hover:text-cyan-400 transition-colors">Dashboard</a>
          <Link href="/voice" className="hover:text-cyan-400 transition-colors">Voice</Link>
          <Link href="/mistral" className="hover:text-cyan-400 transition-colors">🧠 Mistral AI</Link>
          <Link href="/wallet" className="hover:text-cyan-400 transition-colors text-cyan-400">💰 Wallet</Link>
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
            <a href="/#videos" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-cyan-400">Videos</a>
            <a href="/#dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-cyan-400">Dashboard</a>
            <Link href="/voice" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-cyan-400">Voice</Link>
            <Link href="/mistral" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-cyan-400">🧠 Mistral AI</Link>
            <Link href="/wallet" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-cyan-400 text-cyan-400">💰 Wallet</Link>
            <a href="mailto:marwatstack@gmail.com" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-cyan-400">Contact</a>
          </div>
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              💰 Crypto Wallet & Payments
            </h1>
            <p className="text-slate-300 text-lg">
              Manage your crypto wallet and make payments for premium agent features
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <CrossmintWallet />
            </div>
            
            <div className="space-y-6">
              <div className="border border-blue-500/20 rounded-xl p-6 bg-slate-900/70 text-slate-100 shadow-lg shadow-black/20">
                <h3 className="font-semibold text-cyan-300 mb-4">🚀 Premium Features</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-800 rounded">
                    <span className="text-white">Advanced Team Analysis</span>
                    <span className="text-green-400 font-semibold">$5 USDC</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800 rounded">
                    <span className="text-white">Detailed Scouting Reports</span>
                    <span className="text-green-400 font-semibold">$10 USDC</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800 rounded">
                    <span className="text-white">Real-time Betting Insights</span>
                    <span className="text-green-400 font-semibold">$15 USDC</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800 rounded">
                    <span className="text-white">Premium Voice Agent</span>
                    <span className="text-green-400 font-semibold">$20 USDC</span>
                  </div>
                </div>
              </div>

              <div className="border border-green-500/20 rounded-xl p-6 bg-slate-900/70 text-slate-100 shadow-lg shadow-black/20">
                <h3 className="font-semibold text-green-300 mb-4">💡 How It Works</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
                    <span className="text-slate-300">Create your crypto wallet using Crossmint infrastructure</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
                    <span className="text-slate-300">Fund your wallet with USDC stablecoin</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
                    <span className="text-slate-300">Pay for premium agent features instantly</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">4</span>
                    <span className="text-slate-300">Access advanced sports intelligence tools</span>
                  </div>
                </div>
              </div>


              <div className="border border-green-500/20 rounded-xl p-6 bg-slate-900/70 text-slate-100 shadow-lg shadow-black/20">
                <h3 className="font-semibold text-green-300 mb-4">🔒 Security & Compliance</h3>
                <div className="space-y-2 text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span>VASP licensed and regulated</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span>SOC2 Type II compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span>GDPR compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Enterprise-grade security</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span>No gas fees for users</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
