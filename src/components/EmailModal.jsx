import { useState } from "react";
import { Sheet, Btn, inputStyle } from "./ui/SharedUI";

export default function EmailModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  const submit = async () => {
    if (!email || !email.includes("@")) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) setStatus("done");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") return (
    <Sheet title="領取成功" onClose={onClose}>
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#5BA86C12", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5BA86C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, color: "#3A3330", marginBottom: 8 }}>指南已準備好！</div>
        <div style={{ fontSize: 14, color: "#8C8278", lineHeight: 1.7 }}>我們會盡快將《家庭分工溝通指南》<br />寄到你的信箱。<br /><br />正式版工具上線時<br />也會第一時間通知你。</div>
      </div>
      <Btn full onClick={onClose}>好的，期待收到</Btn>
    </Sheet>
  );

  return (
    <Sheet title="免費領取《溝通指南》" onClose={onClose}>
      <div style={{ background: "#F5F0EC", borderRadius: 14, padding: "16px", marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#3A3330", marginBottom: 8 }}>指南內容包含：</div>
        <div style={{ fontSize: 13, color: "#6B635C", lineHeight: 1.8 }}>
          <div style={{ marginBottom: 4 }}>5 個「不吵架」的分工對話範本</div>
          <div style={{ marginBottom: 4 }}>隱形勞務盤點清單（可列印）</div>
          <div style={{ marginBottom: 4 }}>如何讓同住的人「看見」你的付出</div>
          <div>從今天開始的 3 個小改變</div>
        </div>
      </div>
      <input value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} type="email" placeholder="your@email.com" style={inputStyle} autoFocus />
      {status === "error" && <div style={{ fontSize: 13, color: "#D4456A", marginBottom: 12 }}>發生錯誤，請稍後再試</div>}
      <Btn full onClick={submit} disabled={status === "loading"}>
        {status === "loading" ? "送出中..." : "免費領取"}
      </Btn>
      <div style={{ fontSize: 12, color: "#C4B8AE", textAlign: "center", marginTop: 10 }}>不會寄垃圾信，隨時可取消訂閱</div>
    </Sheet>
  );
}
