"use client";

import { useState } from "react";
import AnalysisResult from "@/components/AnalysisResult";
import UrlInput from "@/components/UrlInput";
import ModeSelector from "@/components/ModeSelector";

export type AnalysisMode = "summary" | "trend" | "account" | "hashtag";
export type Platform = "twitter" | "youtube" | "instagram" | "tiktok" | "unknown";

export interface InfographicStep {
  number: number;
  heading: string;
  detail: string;
  tags?: string[];
  icon: string;
  icon2?: string;
}

export interface AnalysisData {
  platform: Platform;
  mode: AnalysisMode;
  url: string;
  raw: string;
  infographic?: {
    title: string;
    subtitle: string;
    steps: InfographicStep[];
    conclusion: string;
  };
  metadata?: Record<string, string>;
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [mode, setMode] = useState<AnalysisMode>("summary");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisData | null>(null);
  const [error, setError] = useState("");

  const analyze = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, mode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "分析に失敗しました");
      setResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen" style={{ background: "#0a0a0f" }}>
      <header className="border-b px-6 py-4" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
            <span className="text-white text-sm font-bold">S</span>
          </div>
          <span className="text-white font-bold text-lg">SNS Lens</span>
          <span className="text-sm ml-2" style={{ color: "rgba(255,255,255,0.4)" }}>AI-powered SNS Analyzer</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: "#e8e8f0" }}>
            SNSコンテンツを<br />
            <span className="gradient-text">AIで即座に分析</span>
          </h1>
          <p className="text-lg" style={{ color: "rgba(255,255,255,0.5)" }}>
            Twitter・YouTube・Instagram・TikTokのURLを貼るだけ
          </p>
        </div>

        <div className="flex justify-center gap-3 mb-10 flex-wrap">
          {[
            { name: "Twitter / X", color: "#1DA1F2", icon: "𝕏" },
            { name: "YouTube", color: "#FF0000", icon: "▶" },
            { name: "Instagram", color: "#E1306C", icon: "◉" },
            { name: "TikTok", color: "#69C9D0", icon: "♪" },
          ].map((p) => (
            <div
              key={p.name}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm"
              style={{ background: `${p.color}20`, border: `1px solid ${p.color}40`, color: p.color }}
            >
              <span>{p.icon}</span>
              <span>{p.name}</span>
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-6 mb-6" style={{ background: "#13131f", border: "1px solid rgba(255,255,255,0.08)" }}>
          <UrlInput url={url} setUrl={setUrl} onAnalyze={analyze} loading={loading} />
          <div className="mt-4">
            <ModeSelector mode={mode} setMode={setMode} />
          </div>
          <button
            onClick={analyze}
            disabled={loading || !url.trim()}
            className="w-full mt-4 py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            style={{
              background: loading || !url.trim() ? "#333" : "linear-gradient(135deg, #667eea, #764ba2)",
            }}
          >
            {loading ? "分析中..." : "分析する"}
          </button>
        </div>

        {error && (
          <div className="rounded-xl p-4 mb-6 fade-in" style={{ background: "#2d1515", border: "1px solid #ff4444" }}>
            <p className="text-sm" style={{ color: "#ff6b6b" }}>{error}</p>
          </div>
        )}

        {loading && (
          <div className="rounded-2xl p-6 fade-in" style={{ background: "#13131f", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="shimmer h-4 rounded mb-3 w-1/3" />
            <div className="shimmer h-3 rounded mb-2" />
            <div className="shimmer h-3 rounded mb-2 w-5/6" />
            <div className="shimmer h-3 rounded mb-2 w-4/6" />
            <div className="shimmer h-3 rounded w-3/6" />
          </div>
        )}

        {result && !loading && <AnalysisResult result={result} />}
      </div>
    </main>
  );
}
