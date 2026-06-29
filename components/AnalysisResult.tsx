"use client";

import type { AnalysisData } from "@/app/page";
import Infographic from "./Infographic";

const PLATFORM_COLORS: Record<string, string> = {
  twitter: "#1DA1F2",
  youtube: "#FF0000",
  instagram: "#E1306C",
  tiktok: "#69C9D0",
  unknown: "#667eea",
};

const PLATFORM_LABELS: Record<string, string> = {
  twitter: "Twitter / X",
  youtube: "YouTube",
  instagram: "Instagram",
  tiktok: "TikTok",
  unknown: "Web",
};

const MODE_LABELS: Record<string, string> = {
  summary: "要約",
  trend: "トレンド分析",
  account: "アカウント分析",
  hashtag: "ハッシュタグ分析",
};

interface Props {
  result: AnalysisData;
}

export default function AnalysisResult({ result }: Props) {
  const color = PLATFORM_COLORS[result.platform];

  return (
    <div className="rounded-2xl overflow-hidden fade-in" style={{ background: "#13131f", border: "1px solid rgba(255,255,255,0.08)" }}>
      {/* Header */}
      <div className="px-6 py-4 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: `${color}20`, color }}>
          {PLATFORM_LABELS[result.platform]}
        </span>
        <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
          {MODE_LABELS[result.mode]}
        </span>
        <a
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs truncate hover:underline ml-auto max-w-xs"
          style={{ color: "#667eea" }}
        >
          {result.url}
        </a>
      </div>

      {/* Infographic or fallback */}
      <div className="px-6 py-6">
        {result.infographic ? (
          <Infographic data={result.infographic} platform={result.platform} />
        ) : (
          <pre className="text-sm whitespace-pre-wrap leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
            {result.raw}
          </pre>
        )}
      </div>
    </div>
  );
}
