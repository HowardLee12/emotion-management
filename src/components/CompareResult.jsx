import { useState, useEffect } from "react";
import { MODES } from "../data/quizData";
import { getResult } from "../utils/scoring";
import { Wrap, Btn, Card } from "./ui/SharedUI";

export default function CompareResult({ myScore, myMode, onBack, onDemo }) {
  const [partnerDone, setPartnerDone] = useState(false);
  const [partnerScore, setPartnerScore] = useState(null);
  const [copied, setCopied] = useState(false);

  const myResult = getResult(myScore, myMode);
  const modeLabel = MODES.find(m => m.id === myMode)?.label || "家人";

  // Generate a unique compare link
  const compareId = useState(() => Math.random().toString(36).substring(2, 10))[0];
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
  const compareLink = `${siteUrl}?compare=${compareId}&mode=${myMode}&score=${myScore}`;

  // Check URL params for partner's result
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pScore = params.get("partner_score");
    if (pScore) {
      setPartnerScore(parseInt(pScore, 10));
      setPartnerDone(true);
    }
  }, []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(compareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = compareLink;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareToLINE = () => {
    const text = `我剛測了「${modeLabel}隱形勞務指數」，想邀請你也來測測看，然後我們來比較結果！👉`;
    const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(compareLink)}&text=${encodeURIComponent(text)}`;
    window.open(lineUrl, "_blank", "noopener,noreferrer");
  };

  // Show comparison if partner has completed
  if (partnerDone && partnerScore !== null) {
    const partnerResult = getResult(partnerScore, myMode);
    const gap = Math.abs(myResult.pct - partnerResult.pct);
    const myP = myResult.personality;
    const partnerP = partnerResult.personality;

    return (
      <Wrap>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔄</div>
          <h2 style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 24, fontWeight: 900, color: "#3A3330" }}>你們的比較報告</h2>
          <div style={{ fontSize: 14, color: "#8C8278", marginTop: 6 }}>{modeLabel}隱形勞務分佈</div>
        </div>

        {/* Side by side comparison */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          <Card style={{ flex: 1, textAlign: "center", padding: "20px 12px", border: `2px solid ${myResult.color}22` }}>
            <div style={{ fontSize: 12, color: "#B0A498", marginBottom: 8 }}>你</div>
            <div style={{ fontSize: 28 }}>{myP.emoji}</div>
            <div style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 32, fontWeight: 900, color: myResult.color, margin: "8px 0" }}>{myResult.pct}%</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: myResult.color }}>{myP.type}</div>
            <div style={{ fontSize: 11, color: "#B0A498", marginTop: 4 }}>{myResult.level}</div>
          </Card>
          <Card style={{ flex: 1, textAlign: "center", padding: "20px 12px", border: `2px solid ${partnerResult.color}22` }}>
            <div style={{ fontSize: 12, color: "#B0A498", marginBottom: 8 }}>{mode === "couple" ? "另一半" : mode === "roommate" ? "室友" : "家人"}</div>
            <div style={{ fontSize: 28 }}>{partnerP.emoji}</div>
            <div style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 32, fontWeight: 900, color: partnerResult.color, margin: "8px 0" }}>{partnerResult.pct}%</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: partnerResult.color }}>{partnerP.type}</div>
            <div style={{ fontSize: 11, color: "#B0A498", marginTop: 4 }}>{partnerResult.level}</div>
          </Card>
        </div>

        {/* Gap analysis */}
        <Card style={{ textAlign: "center", padding: "20px", marginBottom: 20, background: gap > 30 ? "#FFF3E0" : gap > 15 ? "#FFF8E1" : "#F1F8E9" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#3A3330", marginBottom: 8 }}>
            {gap > 30 ? "⚠️ 認知差距較大" : gap > 15 ? "💡 有些差異值得討論" : "✨ 你們的感受很接近"}
          </div>
          <div style={{ fontSize: 13, color: "#6B635C", lineHeight: 1.7 }}>
            {gap > 30
              ? "你們對勞務分配的感受差距明顯。建議找個平靜的時間，用「我覺得...」的句型開啟對話，而不是指責。"
              : gap > 15
              ? "有一些地方你們的感受不太一樣，這很正常。試著分享彼此的「隱形清單」，你會發現很多對方沒注意到的事。"
              : "這代表你們對家務分配有相似的認知，這是很好的溝通基礎！繼續保持開放的對話。"}
          </div>
        </Card>

        <Btn full onClick={onDemo} style={{ marginBottom: 10 }}>🏠 一起試玩「家務分擔」工具 →</Btn>
        <Btn full secondary onClick={onBack} style={{ marginBottom: 20 }}>← 回到我的結果</Btn>
      </Wrap>
    );
  }

  // Waiting for partner - show invite screen
  return (
    <Wrap center>
      <div style={{ fontSize: 56, marginBottom: 20, animation: "float 3s ease infinite" }}>🔗</div>
      <h2 style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 24, fontWeight: 900, color: "#3A3330", marginBottom: 10 }}>
        邀請{mode === "roommate" ? "室友" : mode === "couple" ? "另一半" : "家人"}一起測
      </h2>
      <p style={{ fontSize: 14, color: "#8C8278", lineHeight: 1.7, marginBottom: 28 }}>
        把連結傳給對方，等對方也做完測驗後，<br />就能看到你們的對比報告！
      </p>

      {/* Link display */}
      <Card style={{ padding: "16px", marginBottom: 16, wordBreak: "break-all" }}>
        <div style={{ fontSize: 12, color: "#B0A498", marginBottom: 8 }}>專屬比較連結</div>
        <div style={{ fontSize: 13, color: "#6B635C", lineHeight: 1.5 }}>{compareLink}</div>
      </Card>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
        <Btn full onClick={copyLink}>
          {copied ? "✅ 已複製！" : "📋 複製連結"}
        </Btn>
        <button onClick={shareToLINE} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "14px", background: "#06C755", color: "white", borderRadius: 16, fontSize: 15, fontWeight: 600, border: "none", cursor: "pointer", fontFamily: "'Noto Sans TC', sans-serif", boxShadow: "0 4px 16px rgba(6,199,85,0.2)" }}>
          <span style={{ fontSize: 20 }}>💬</span> 直接用 LINE 傳送
        </button>
      </div>

      <Btn full secondary onClick={onBack}>← 回到我的結果</Btn>
    </Wrap>
  );
}
