import { useState } from "react";
import { Wrap, Btn, Card, inputStyle } from "./ui/SharedUI";

const MEMBER_COLORS = ["#D4456A", "#5B9ECC", "#5BA86C", "#D4A843", "#9B7DC4", "#E88B3E"];

export default function Onboarding({ onDone }) {
  const [step, setStep] = useState(0);
  const [familyName, setFamilyName] = useState("我們的家");
  const [members, setMembers] = useState([
    { name: "媽媽", emoji: "A", color: MEMBER_COLORS[0], points: 0, streak: 0 },
    { name: "爸爸", emoji: "B", color: MEMBER_COLORS[1], points: 0, streak: 0 },
  ]);
  const [addName, setAddName] = useState("");

  const add = () => {
    if (!addName.trim() || members.length >= 6) return;
    const i = members.length;
    const initial = addName.trim().charAt(0).toUpperCase();
    setMembers([...members, { name: addName.trim(), emoji: initial, color: MEMBER_COLORS[i % MEMBER_COLORS.length], points: 0, streak: 0 }]);
    setAddName("");
  };

  if (step === 0) return (
    <Wrap center>
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, #E8A0BF15, #D4456A10)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4456A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      </div>
      <h1 style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 28, fontWeight: 900, color: "#3A3330", marginBottom: 10 }}>為你的家取個名字</h1>
      <p style={{ fontSize: 15, color: "#8C8278", marginBottom: 28 }}>這會顯示在你們的共享空間</p>
      <input value={familyName} onChange={e => setFamilyName(e.target.value)} style={inputStyle} placeholder="例：小陳家" />
      <Btn full onClick={() => setStep(1)} style={{ marginTop: 8 }}>下一步</Btn>
    </Wrap>
  );

  return (
    <Wrap>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#F5F0EC", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8C8278" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <h2 style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 24, fontWeight: 900, color: "#3A3330", marginBottom: 6 }}>誰住在「{familyName}」？</h2>
        <p style={{ fontSize: 14, color: "#8C8278" }}>至少需要兩位成員</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {members.map((m, i) => (
          <Card key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: m.color, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{m.name.charAt(0)}</div>
            <input value={m.name} onChange={e => { const v = e.target.value; setMembers(ms => ms.map((x,j) => j === i ? {...x, name: v} : x)); }} style={{ border: "none", outline: "none", fontSize: 15, fontWeight: 600, flex: 1, fontFamily: "'Noto Sans TC', sans-serif", background: "transparent", color: m.color }} />
            {members.length > 2 && <button onClick={() => setMembers(ms => ms.filter((_,j) => j !== i))} style={{ background: "none", border: "none", fontSize: 16, color: "#ccc", cursor: "pointer" }}>&times;</button>}
          </Card>
        ))}
      </div>
      {members.length < 6 && (
        <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
          <input value={addName} onChange={e => setAddName(e.target.value)} onKeyDown={e => e.key === "Enter" && add()} placeholder="新增成員..." style={{ ...inputStyle, flex: 1, marginBottom: 0 }} />
          <Btn secondary small onClick={add}>新增</Btn>
        </div>
      )}
      <Btn full onClick={() => onDone(familyName, members)}>開始使用</Btn>
    </Wrap>
  );
}
