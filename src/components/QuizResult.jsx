import { useState, useEffect } from "react";
import { MODES } from "../data/quizData";
import { getResult, generateShareText } from "../utils/scoring";
import { Wrap, Btn, Card } from "./ui/SharedUI";
import { shareLINE, isInLIFF } from "../lib/liff";

export default function QuizResult({ score, mode, onDemo, onCompare }) {
  const r = getResult(score, mode);
  const modeLabel = MODES.find(m => m.id === mode)?.label || "家人";
  const [count, setCount] = useState(0);
  const [show, setShow] = useState(false);
  const siteUrl = typeof window !== "undefined" ? window.location.href.split("?")[0] : "";
  const shareText = generateShareText(r, mode, modeLabel);
  const lineShareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(siteUrl)}&text=${encodeURIComponent(shareText)}`;

  useEffect(() => {
    let f = 0;
    const t = setInterval(() => {
      f++;
      setCount(Math.round((f / 40) * r.pct));
      if (f >= 40) { setCount(r.pct); clearInterval(t); setTimeout(() => setShow(true), 300); }
    }, 28);
    return () => clearInterval(t);
  }, [r.pct]);

  const handleShare = async () => {
    const inLiff = isInLIFF();
    if (inLiff) {
      const shared = await shareLINE(shareText + "\n" + siteUrl);
      if (shared) return;
    }
    window.open(lineShareUrl, "_blank", "noopener,noreferrer");
  };

  const p = r.personality;

  return (
    <Wrap>
      {/* Result Card */}
      <div style={{ background: `${r.color}08`, borderRadius: 28, padding: "36px 28px 20px", textAlign: "center", boxShadow: "0 8px 40px rgba(0,0,0,0.05)", marginBottom: 8, border: `1px solid ${r.color}15` }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: "#B0A498", letterSpacing: 2, marginBottom: 20 }}>{modeLabel}隱形勞務指數</div>

        {/* Gauge */}
        <div style={{ position: "relative", width: 200, height: 120, margin: "0 auto 8px" }}>
          <svg width="200" height="120" viewBox="0 0 200 120">
            <path d="M 20 110 A 80 80 0 0 1 180 110" fill="none" stroke="#EDE8E2" strokeWidth="12" strokeLinecap="round" />
            <path d="M 20 110 A 80 80 0 0 1 180 110" fill="none" stroke={r.color} strokeWidth="12" strokeLinecap="round" strokeDasharray={`${(count / 100) * 251.2} 251.2`} style={{ transition: "stroke-dasharray 0.3s" }} />
          </svg>
          <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", textAlign: "center" }}>
            <div style={{ fontFamily: "'Noto Serif TC', serif", fontSize: count >= 100 ? 36 : 44, fontWeight: 900, color: r.color, lineHeight: 1 }}>{count}%</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: "#8C8278", marginTop: 4 }}>{r.level}</div>
          </div>
        </div>

        {/* Personality Type Badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${r.color}15`, padding: "8px 20px", borderRadius: 20, marginTop: 12, marginBottom: 16 }}>
          <span style={{ fontSize: 20 }}>{p.emoji}</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: r.color }}>{p.type}</span>
        </div>
        <div style={{ fontSize: 12, color: "#B0A498", marginBottom: 12 }}>{p.tag}</div>

        <h2 style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 22, fontWeight: 700, color: "#3A3330", marginTop: 8, marginBottom: 10 }}>{r.title}</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: "#7A736C", marginBottom: 16 }}>{r.desc}</p>

        {/* Personality description */}
        <div style={{ fontSize: 13, lineHeight: 1.7, color: "#8C8278", fontStyle: "italic", marginBottom: 20 }}>
          「{p.desc}」
        </div>

        <div style={{ display: "flex", gap: 12, textAlign: "left", padding: "14px 16px", background: "white", borderRadius: 16, border: `1px solid ${r.color}22` }}>
          <div style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>💡</div>
          <div style={{ fontSize: 13, lineHeight: 1.7, color: "#6B635C" }}>{r.advice}</div>
        </div>
      </div>

      {/* Screenshot hint */}
      <div style={{ textAlign: "center", padding: "10px 0 20px", fontSize: 12, color: "#C4B8AE" }}>
        📱 截圖就能分享到限動 / 群組
      </div>

      {/* Share + Action buttons */}
      <div style={{ opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(20px)", transition: "all 0.5s" }}>

        {/* LINE share */}
        <button onClick={handleShare} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "14px", background: "#06C755", color: "white", borderRadius: 16, fontSize: 15, fontWeight: 600, border: "none", cursor: "pointer", marginBottom: 10, fontFamily: "'Noto Sans TC', sans-serif", boxShadow: "0 4px 16px rgba(6,199,85,0.2)" }}>
          <span style={{ fontSize: 20 }}>💬</span> 用 LINE 分享給{mode === "roommate" ? "室友" : mode === "couple" ? "另一半" : "家人"}
        </button>

        {/* Invite partner to compare */}
        <button onClick={onCompare} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "14px", background: "white", color: "#D4456A", borderRadius: 16, fontSize: 15, fontWeight: 600, border: "1.5px solid #E8A0BF33", cursor: "pointer", marginBottom: 10, fontFamily: "'Noto Sans TC', sans-serif", boxShadow: "0 2px 12px rgba(212,69,106,0.08)" }}>
          <span style={{ fontSize: 20 }}>🔄</span> 邀請{mode === "roommate" ? "室友" : mode === "couple" ? "另一半" : "家人"}一起測，看看差多少
        </button>

        <Btn full onClick={onDemo} style={{ marginBottom: 10 }}>🏠 免費試玩「家務分擔」工具 →</Btn>
        <div style={{ fontSize: 12, color: "#C4B8AE", textAlign: "center", marginBottom: 20 }}>不用註冊，立即體驗完整功能</div>
      </div>
    </Wrap>
  );
}
