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
  const otherLabel = myMode === "roommate" ? "室友" : myMode === "couple" ? "另一半" : "家人";

  const compareId = useState(() => Math.random().toString(36).substring(2, 10))[0];
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
  const compareLink = `${siteUrl}?compare=${compareId}&mode=${myMode}&score=${myScore}`;

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
    const text = `我剛測了「${modeLabel}隱形勞務指數」，想邀請你也來測測看，然後我們來比較結果！`;
    const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(compareLink)}&text=${encodeURIComponent(text)}`;
    window.open(lineUrl, "_blank", "noopener,noreferrer");
  };

  if (partnerDone && partnerScore !== null) {
    const partnerResult = getResult(partnerScore, myMode);
    const gap = Math.abs(myResult.pct - partnerResult.pct);
    const myP = myResult.personality;
    const partnerP = partnerResult.personality;

    return (
      <Wrap>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#F5F0EC", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8C8278" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
          </div>
          <h2 style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 24, fontWeight: 900, color: "#3A3330" }}>你們的比較報告</h2>
          <div style={{ fontSize: 14, color: "#8C8278", marginTop: 6 }}>{modeLabel}隱形勞務分佈</div>
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          <Card style={{ flex: 1, textAlign: "center", padding: "20px 12px", border: `2px solid ${myResult.color}22` }}>
            <div style={{ fontSize: 12, color: "#B0A498", marginBottom: 8 }}>你</div>
            <div style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 32, fontWeight: 900, color: myResult.color, margin: "8px 0" }}>{myResult.pct}%</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: myResult.color }}>{myP.type}</div>
            <div style={{ fontSize: 11, color: "#B0A498", marginTop: 4 }}>{myResult.level}</div>
          </Card>
          <Card style={{ flex: 1, textAlign: "center", padding: "20px 12px", border: `2px solid ${partnerResult.color}22` }}>
            <div style={{ fontSize: 12, color: "#B0A498", marginBottom: 8 }}>{otherLabel}</div>
            <div style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 32, fontWeight: 900, color: partnerResult.color, margin: "8px 0" }}>{partnerResult.pct}%</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: partnerResult.color }}>{partnerP.type}</div>
            <div style={{ fontSize: 11, color: "#B0A498", marginTop: 4 }}>{partnerResult.level}</div>
          </Card>
        </div>

        <Card style={{ textAlign: "center", padding: "20px", marginBottom: 20, background: gap > 30 ? "#FFF3E0" : gap > 15 ? "#FFF8E1" : "#F1F8E9" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#3A3330", marginBottom: 8 }}>
            {gap > 30 ? "認知差距較大" : gap > 15 ? "有些差異值得討論" : "你們的感受很接近"}
          </div>
          <div style={{ fontSize: 13, color: "#6B635C", lineHeight: 1.7 }}>
            {gap > 30
              ? "你們對勞務分配的感受差距明顯。建議找個平靜的時間，用「我覺得...」的句型開啟對話，而不是指責。"
              : gap > 15
              ? "有一些地方你們的感受不太一樣，這很正常。試著分享彼此的「隱形清單」，你會發現很多對方沒注意到的事。"
              : "這代表你們對家務分配有相似的認知，這是很好的溝通基礎！繼續保持開放的對話。"}
          </div>
        </Card>

        <Btn full onClick={onDemo} style={{ marginBottom: 10 }}>一起試玩「家務分擔」工具</Btn>
        <Btn full secondary onClick={onBack} style={{ marginBottom: 20 }}>回到我的結果</Btn>
      </Wrap>
    );
  }

  return (
    <Wrap center>
      <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#F5F0EC", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8C8278" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
      </div>
      <h2 style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 24, fontWeight: 900, color: "#3A3330", marginBottom: 10 }}>
        邀請{otherLabel}一起測
      </h2>
      <p style={{ fontSize: 14, color: "#8C8278", lineHeight: 1.7, marginBottom: 28 }}>
        把連結傳給對方，等對方做完測驗後，<br />就能看到你們的對比報告。
      </p>

      <Card style={{ padding: "16px", marginBottom: 16, wordBreak: "break-all" }}>
        <div style={{ fontSize: 12, color: "#B0A498", marginBottom: 8 }}>專屬比較連結</div>
        <div style={{ fontSize: 13, color: "#6B635C", lineHeight: 1.5 }}>{compareLink}</div>
      </Card>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
        <Btn full onClick={copyLink}>
          {copied ? "已複製！" : "複製連結"}
        </Btn>
        <button onClick={shareToLINE} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, width: "100%", padding: "14px", background: "#06C755", color: "white", borderRadius: 16, fontSize: 15, fontWeight: 600, border: "none", cursor: "pointer", fontFamily: "'Noto Sans TC', sans-serif", boxShadow: "0 4px 16px rgba(6,199,85,0.2)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>
          直接用 LINE 傳送
        </button>
      </div>

      <Btn full secondary onClick={onBack}>回到我的結果</Btn>
    </Wrap>
  );
}
