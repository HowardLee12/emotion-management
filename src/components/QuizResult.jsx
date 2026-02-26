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
  const shareText = generateShareText(r);
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
    if (isInLIFF()) {
      const shared = await shareLINE(shareText + "\n" + siteUrl);
      if (shared) return;
    }
    window.open(lineShareUrl, "_blank", "noopener,noreferrer");
  };

  const p = r.personality;
  const otherLabel = mode === "roommate" ? "室友" : mode === "couple" ? "另一半" : "家人";

  return (
    <Wrap>
      {/* Result Card */}
      <div style={{ background: `${r.color}08`, borderRadius: 28, padding: "36px 28px 28px", textAlign: "center", boxShadow: "0 8px 40px rgba(0,0,0,0.05)", marginBottom: 8, border: `1px solid ${r.color}15` }}>
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
        <div style={{ display: "inline-block", background: `${p.color}12`, padding: "10px 24px", borderRadius: 24, marginTop: 16, marginBottom: 8 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: p.color, fontFamily: "'Noto Serif TC', serif" }}>{p.type}</span>
        </div>
        <div style={{ fontSize: 12, color: "#B0A498", marginBottom: 16, letterSpacing: 1 }}>{p.tag}</div>

        <h2 style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 20, fontWeight: 700, color: "#3A3330", marginBottom: 10 }}>{r.title}</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: "#7A736C", marginBottom: 16 }}>{r.desc}</p>

        <p style={{ fontSize: 13, lineHeight: 1.7, color: "#8C8278", fontStyle: "italic", marginBottom: 20, padding: "0 8px" }}>
          「{p.desc}」
        </p>

        <div style={{ display: "flex", gap: 12, textAlign: "left", padding: "14px 16px", background: "white", borderRadius: 16, border: `1px solid ${r.color}22` }}>
          <div style={{ width: 4, borderRadius: 2, background: r.color, flexShrink: 0 }} />
          <div style={{ fontSize: 13, lineHeight: 1.7, color: "#6B635C" }}>{r.advice}</div>
        </div>
      </div>

      {/* Screenshot hint */}
      <div style={{ textAlign: "center", padding: "10px 0 20px", fontSize: 12, color: "#C4B8AE" }}>
        截圖就能分享到限動或群組
      </div>

      {/* Share + Action buttons */}
      <div style={{ opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(20px)", transition: "all 0.5s" }}>

        {/* LINE share */}
        <button onClick={handleShare} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, width: "100%", padding: "14px", background: "#06C755", color: "white", borderRadius: 16, fontSize: 15, fontWeight: 600, border: "none", cursor: "pointer", marginBottom: 10, fontFamily: "'Noto Sans TC', sans-serif", boxShadow: "0 4px 16px rgba(6,199,85,0.2)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>
          用 LINE 分享給{otherLabel}
        </button>

        {/* Invite partner to compare */}
        <button onClick={onCompare} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, width: "100%", padding: "14px", background: "white", color: "#D4456A", borderRadius: 16, fontSize: 15, fontWeight: 600, border: "1.5px solid #E8A0BF33", cursor: "pointer", marginBottom: 10, fontFamily: "'Noto Sans TC', sans-serif" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4456A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
          邀請{otherLabel}一起測，看看差多少
        </button>

        <Btn full onClick={onDemo} style={{ marginBottom: 10 }}>免費試玩「家務分擔」工具</Btn>
        <div style={{ fontSize: 12, color: "#C4B8AE", textAlign: "center", marginBottom: 20 }}>不用註冊，立即體驗完整功能</div>
      </div>
    </Wrap>
  );
}
