"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useConversation } from "@elevenlabs/react";
import Link from "next/link";
import Script from "next/script";

// Optional: read agentId from public env; if absent, server function must have ELEVEN_AGENT_ID configured
const PUBLIC_AGENT_ID = process.env.NEXT_PUBLIC_ELEVEN_AGENT_ID;

// Safe helpers without using `any`
function extractText(msg: unknown): string | null {
  if (typeof msg === "string") return msg;
  if (msg && typeof msg === "object") {
    const o = msg as Record<string, unknown>;
    if (typeof o.text === "string") return o.text;
    if (typeof o.message === "string") return o.message;
    if (typeof o.content === "string") return o.content;
  }
  return null;
}

function toDisplayString(msg: unknown): string {
  const t = extractText(msg);
  if (t) return t;
  try {
    return JSON.stringify(msg);
  } catch {
    return "[unserializable message]";
  }
}

export default function VoicePage() {
  const [error, setError] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [connecting, setConnecting] = useState(false);
  const [micMuted, setMicMuted] = useState(true);
  const pttDownRef = useRef(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const onMessage = useCallback((msg: unknown) => {
    setLog((prev) => [toDisplayString(msg), ...prev].slice(0, 200));
  }, []);

  const onError = useCallback((err: unknown) => {
    const msg = err instanceof Error ? err.message : typeof err === "string" ? err : JSON.stringify(err);
    setError(msg);
  }, []);

  const onConnect = useCallback(() => {
    setError(null);
  }, []);

  const onDisconnect = useCallback(() => {
    // ensure PTT state resets
    pttDownRef.current = false;
  }, []);

  const conversation = useConversation({
    onMessage,
    onError,
    onConnect,
    onDisconnect,
    micMuted,
    // Small UX improvements
    preferHeadphonesForIosDevices: true,
  });

  const { status, isSpeaking, canSendFeedback } = conversation;
  const agentId = PUBLIC_AGENT_ID || "agent_5401k27xr572e2bavxz9nm9vztd1";

  const connect = useCallback(async () => {
    try {
      setConnecting(true);
      setError(null);
      // Prompt mic permission early per SDK guidance
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (micErr) {
        throw new Error("Microphone permission denied or unavailable");
      }

      const qs = PUBLIC_AGENT_ID ? `?agent_id=${encodeURIComponent(PUBLIC_AGENT_ID)}` : "";
      const resp = await fetch(`/.netlify/functions/elevenSignedUrl${qs}`);
      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || "Failed to obtain signed URL");
      }
      const data = (await resp.json()) as { signedUrl?: string };
      if (!data.signedUrl) throw new Error("Missing signedUrl in response");

      // Start session via WebSocket using the signed URL
      await conversation.startSession({
        signedUrl: data.signedUrl,
        connectionType: "websocket",
      });

      // Default to muted until PTT is pressed
      setMicMuted(true);
    } catch (e) {
      const msg = e instanceof Error ? e.message : typeof e === "string" ? e : JSON.stringify(e);
      setError(msg);
    } finally {
      setConnecting(false);
    }
  }, [conversation]);

  const disconnect = useCallback(async () => {
    try {
      await conversation.endSession();
    } catch (e) {
      const msg = e instanceof Error ? e.message : typeof e === "string" ? e : JSON.stringify(e);
      setError(msg);
    }
  }, [conversation]);

  // Push-to-talk: space key hold
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code === "Space" && conversation && status === "connected") {
        if (!pttDownRef.current) {
          pttDownRef.current = true;
          setMicMuted(false);
        }
        e.preventDefault();
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === "Space" && conversation && status === "connected") {
        pttDownRef.current = false;
        setMicMuted(true);
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [conversation, status]);

  // Touch/mouse PTT button handlers
  const handlePttStart = useCallback(() => {
    if (status === "connected") {
      pttDownRef.current = true;
      setMicMuted(false);
    }
  }, [conversation, status]);

  const handlePttEnd = useCallback(() => {
    if (status === "connected") {
      pttDownRef.current = false;
      setMicMuted(true);
    }
  }, [conversation, status]);

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
          <Link href="/#videos" className="hover:text-cyan-400 transition-colors">Videos</Link>
          <Link href="/agents" className="hover:text-cyan-400 transition-colors">🤖 Agents</Link>
          <Link href="/voice" className="text-cyan-400 font-medium">Voice</Link>
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
      </nav>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-700/50 bg-slate-900/95">
          <div className="container py-4 flex flex-col gap-4">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-cyan-400">Home</Link>
            <Link href="/#videos" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-cyan-400">Videos</Link>
            <Link href="/agents" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-cyan-400">🤖 Agents</Link>
            <Link href="/voice" onClick={() => setIsMobileMenuOpen(false)} className="text-cyan-400 font-medium">Voice</Link>
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
          Betting Analyst (Real-Time)
        </h1>
        <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
          Use the floating voice widget to talk to the agent in real-time.
        </p>
        <p className="mt-3 text-cyan-300 font-semibold">Push-to-talk and live responses</p>
      </header>

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

      {/* ElevenLabs widget */}
      <Script src="https://unpkg.com/@elevenlabs/convai-widget-embed" strategy="afterInteractive" />
      {/* @ts-expect-error - custom element provided by external script */}
      <elevenlabs-convai agent-id={agentId}></elevenlabs-convai>
    </div>
  );
}
