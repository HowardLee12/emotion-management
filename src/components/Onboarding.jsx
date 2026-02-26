import { useState } from "react";
import { Wrap, Btn, Card } from "./ui/SharedUI";
import { inputStyle } from "./ui/SharedUI";

export default function Onboarding({ onDone }) {
  const [step, setStep] = useState(0);
  const [familyName, setFamilyName] = useState("我們的家");
  const [members, setMembers] = useState([
    { name: "媽媽", emoji: "👩", color: "#D4456A", points: 0, streak: 0 },
    { name: "爸爸", emoji: "👨", color: "#5B9ECC", points: 0, streak: 0 },
  ]);
  const [addName, setAddName] = useState("");

  const emojis = ["👧","👦","👴","👵","🧑","🐕"];
  const colors = ["#5BA86C","#D4A843","#9B7DC4","#E88B3E","#5B9ECC"];

  const add = () => {
    if (!addName.trim() || members.length >= 6) return;
    const i = members.length;
    setMembers([...members, { name: addName.trim(), emoji: emojis[i % emojis.length], color: colors[i % colors.length], points: 0, streak: 0 }]);
    setAddName("");
  };

  if (step === 0) return (
    <Wrap center>
      <div style={{ fontSize: 56, marginBottom: 20, animation: "float 3s ease infinite" }}>🏠</div>
      <h1 style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 28, fontWeight: 900, color: "#3A3330", marginBottom: 10 }}>為你的家取個名字</h1>
      <p style={{ fontSize: 15, color: "#8C8278", marginBottom: 28 }}>這會顯示在你們的共享空間</p>
      <input value={familyName} onChange={e => setFamilyName(e.target.value)} style={inputStyle} placeholder="例：小陳家" />
      <Btn full onClick={() => setStep(1)} style={{ marginTop: 8 }}>下一步 →</Btn>
    </Wrap>
  );

  return (
    <Wrap>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 40, marginBottom: 12, animation: "float 3s ease infinite" }}>👨‍👩‍👧</div>
        <h2 style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 24, fontWeight: 900, color: "#3A3330", marginBottom: 6 }}>誰住在「{familyName}」？</h2>
        <p style={{ fontSize: 14, color: "#8C8278" }}>至少需要兩位成員</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {members.map((m, i) => (
          <Card key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px" }}>
            <span style={{ fontSize: 28 }}>{m.emoji}</span>
            <input value={m.name} onChange={e => { const v = e.target.value; setMembers(ms => ms.map((x,j) => j === i ? {...x, name: v} : x)); }} style={{ border: "none", outline: "none", fontSize: 15, fontWeight: 600, flex: 1, fontFamily: "'Noto Sans TC', sans-serif", background: "transparent", color: m.color }} />
            {members.length > 2 && <button onClick={() => setMembers(ms => ms.filter((_,j) => j !== i))} style={{ background: "none", border: "none", fontSize: 16, color: "#ccc", cursor: "pointer" }}>✕</button>}
          </Card>
        ))}
      </div>
      {members.length < 6 && (
        <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
          <input value={addName} onChange={e => setAddName(e.target.value)} onKeyDown={e => e.key === "Enter" && add()} placeholder="新增成員..." style={{ ...inputStyle, flex: 1, marginBottom: 0 }} />
          <Btn secondary small onClick={add}>+ 新增</Btn>
        </div>
      )}
      <Btn full onClick={() => onDone(familyName, members)}>開始使用 🎉</Btn>
    </Wrap>
  );
}
