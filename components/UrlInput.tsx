"use client";

interface Props {
  url: string;
  setUrl: (v: string) => void;
  onAnalyze: () => void;
  loading: boolean;
}

export default function UrlInput({ url, setUrl, onAnalyze, loading }: Props) {
  return (
    <div>
      <label className="block text-sm mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>
        SNSのURL
      </label>
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && !loading && onAnalyze()}
        placeholder="https://twitter.com/... または https://youtube.com/..."
        className="w-full px-4 py-3 rounded-xl text-white placeholder-white/30 outline-none transition-all"
        style={{
          background: "#0a0a0f",
          border: "1px solid rgba(255,255,255,0.12)",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#667eea")}
        onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
      />
    </div>
  );
}
