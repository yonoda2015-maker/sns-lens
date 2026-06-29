"use client";

import type { AnalysisMode } from "@/app/page";

const MODES: { value: AnalysisMode; label: string; desc: string }[] = [
  { value: "summary", label: "要約", desc: "投稿・スレッドを要約" },
  { value: "trend", label: "トレンド分析", desc: "話題のテーマを抽出" },
  { value: "account", label: "アカウント分析", desc: "発言傾向を分析" },
  { value: "hashtag", label: "ハッシュタグ", desc: "タグごとにまとめる" },
];

interface Props {
  mode: AnalysisMode;
  setMode: (m: AnalysisMode) => void;
}

export default function ModeSelector({ mode, setMode }: Props) {
  return (
    <div>
      <label className="block text-sm mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>
        分析モード
      </label>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {MODES.map((m) => (
          <button
            key={m.value}
            onClick={() => setMode(m.value)}
            className="p-3 rounded-xl text-left transition-all cursor-pointer"
            style={{
              background: mode === m.value ? "rgba(102,126,234,0.2)" : "rgba(255,255,255,0.04)",
              border: mode === m.value ? "1px solid #667eea" : "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="text-sm font-medium" style={{ color: mode === m.value ? "#a78bfa" : "#e8e8f0" }}>
              {m.label}
            </div>
            <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
              {m.desc}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
