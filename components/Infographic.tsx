"use client";

import { useRef } from "react";

export interface InfographicData {
  title: string;
  subtitle: string;
  steps: { number: number; heading: string; detail: string; tags?: string[]; icon: string; icon2?: string }[];
  conclusion: string;
}

interface Props {
  data: InfographicData;
  platform: string;
}

const FONT = "'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic UI', 'Meiryo', sans-serif";

export default function Infographic({ data, platform }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const download = async () => {
    if (!ref.current) return;
    const { default: html2canvas } = await import("html2canvas");
    const canvas = await html2canvas(ref.current, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
    });
    const link = document.createElement("a");
    link.download = `sns-lens-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="fade-in">
      <div
        ref={ref}
        style={{
          background: "#ffffff",
          fontFamily: FONT,
          padding: "32px 28px 28px",
          width: "620px",
          margin: "0 auto",
          borderRadius: "16px",
          border: "3px solid #111",
          boxShadow: "6px 6px 0 #111",
        }}
      >
        {/* ===== TITLE ===== */}
        <div style={{ textAlign: "center", marginBottom: "12px" }}>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: 900,
              color: "#111",
              margin: "0 0 8px",
              lineHeight: 1.25,
              wordBreak: "break-all",
              letterSpacing: "-0.02em",
              display: "inline-block",
              backgroundImage: "linear-gradient(transparent 54%, #c8f000 54%)",
              padding: "0 4px",
              fontFamily: FONT,
            }}
          >
            {data.title}
          </h1>
          <p style={{
            fontSize: "13px",
            color: "#555",
            margin: 0,
            fontWeight: 700,
            fontFamily: FONT,
          }}>
            {data.subtitle}
          </p>
        </div>

        {/* Divider */}
        <div style={{ borderTop: "2.5px solid #111", margin: "0 0 14px" }} />

        {/* ===== STEPS ===== */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {data.steps.map((step, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>

              {/* ── Card ── */}
              <div
                style={{
                  display: "flex",
                  alignItems: "stretch",
                  width: "100%",
                  border: "2px solid #111",
                  borderRadius: "12px",
                  overflow: "hidden",
                  background: "#fff",
                  minHeight: "90px",
                }}
              >
                {/* LEFT: main illustration */}
                <div
                  style={{
                    position: "relative",
                    width: "100px",
                    minWidth: "100px",
                    background: "#f4ffe0",
                    borderRight: "2px solid #111",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "20px 6px 14px",
                  }}
                >
                  {/* Number badge */}
                  <div
                    style={{
                      position: "absolute",
                      top: "7px",
                      left: "7px",
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background: "#b8e000",
                      border: "2.5px solid #111",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 900,
                      fontSize: "13px",
                      color: "#111",
                      fontFamily: FONT,
                    }}
                  >
                    {step.number}
                  </div>

                  {/* Main icon — large */}
                  <div style={{ fontSize: "62px", lineHeight: 1, marginTop: "10px" }}>
                    {step.icon}
                  </div>
                </div>

                {/* CENTER: text area */}
                <div
                  style={{
                    flex: 1,
                    padding: "12px 12px 12px 14px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: "5px",
                  }}
                >
                  {/* Heading */}
                  <div
                    style={{
                      fontSize: "17px",
                      fontWeight: 900,
                      color: "#111",
                      lineHeight: 1.3,
                      letterSpacing: "-0.02em",
                      fontFamily: FONT,
                    }}
                  >
                    {step.heading}
                  </div>

                  {/* Tags */}
                  {step.tags && step.tags.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                      {step.tags.map((tag, ti) => (
                        <span
                          key={ti}
                          style={{
                            display: "inline-block",
                            padding: "2px 8px",
                            borderRadius: "20px",
                            fontSize: "11px",
                            fontWeight: 700,
                            background: /[\d%万千億ドル円]/.test(tag) ? "#c8f000" : "#f0f0f0",
                            color: "#111",
                            border: "1.5px solid #bbb",
                            whiteSpace: "nowrap",
                            fontFamily: FONT,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Detail */}
                  {step.detail && (
                    <div
                      style={{
                        fontSize: "11.5px",
                        color: "#444",
                        lineHeight: 1.75,
                        fontWeight: 400,
                        fontFamily: FONT,
                      }}
                    >
                      {step.detail}
                    </div>
                  )}
                </div>

                {/* RIGHT: icon2 — result/effect illustration */}
                {step.icon2 && (
                  <div
                    style={{
                      width: "72px",
                      minWidth: "72px",
                      background: "#fafafa",
                      borderLeft: "2px solid #111",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div style={{ fontSize: "46px", lineHeight: 1 }}>
                      {step.icon2}
                    </div>
                  </div>
                )}
              </div>

              {/* ── Connector ── */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: "2.5px", height: "10px", background: "#333" }} />
                <div style={{
                  width: 0, height: 0,
                  borderLeft: "8px solid transparent",
                  borderRight: "8px solid transparent",
                  borderTop: "11px solid #333",
                }} />
              </div>

            </div>
          ))}
        </div>

        {/* ===== CONCLUSION ===== */}
        <div
          style={{
            background: "#b8e000",
            border: "2.5px solid #111",
            borderRadius: "12px",
            padding: "15px 20px",
            textAlign: "center",
            marginTop: "2px",
          }}
        >
          <span style={{ fontSize: "12px", color: "#666", marginRight: "8px" }}>≡≡</span>
          <span style={{
            fontSize: "19px",
            fontWeight: 900,
            color: "#111",
            letterSpacing: "-0.01em",
            fontFamily: FONT,
          }}>
            {data.conclusion}
          </span>
          <span style={{ fontSize: "12px", color: "#666", marginLeft: "8px" }}>≡≡</span>
        </div>

        {/* Footer */}
        <p style={{ textAlign: "right", fontSize: "9px", color: "#bbb", marginTop: "10px", marginBottom: 0 }}>
          SNS Lens × {platform.toUpperCase()}
        </p>
      </div>

      {/* Download button */}
      <div style={{ textAlign: "center", marginTop: "16px" }}>
        <button
          onClick={download}
          className="cursor-pointer px-6 py-2.5 rounded-xl font-semibold text-white text-sm transition-all"
          style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
        >
          📥 PNG でダウンロード
        </button>
      </div>
    </div>
  );
}
