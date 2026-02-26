import { MODES } from "../data/quizData";
import { Wrap } from "./ui/SharedUI";

export default function ModeSelector({ onSelect }) {
  return (
    <Wrap center anim="fadeUp">
      <div style={{ fontSize: 48, marginBottom: 16, animation: "float 3s ease infinite" }}>🤔</div>
      <h2 style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 26, fontWeight: 900, color: "#3A3330", marginBottom: 8 }}>你和誰住在一起？</h2>
      <p style={{ fontSize: 14, color: "#8C8278", marginBottom: 32 }}>我們會根據你的狀況出不同的題目</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {MODES.map(m => (
          <button key={m.id} onClick={() => onSelect(m.id)} style={{
            display: "flex", alignItems: "center", gap: 16, width: "100%",
            padding: "20px 22px", borderRadius: 20, border: "1.5px solid #EDE8E2",
            background: "white", cursor: "pointer", textAlign: "left",
            fontFamily: "'Noto Sans TC', sans-serif", transition: "all 0.2s",
            boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
          }}
          onMouseOver={e => { e.currentTarget.style.borderColor = m.color + "66"; e.currentTarget.style.background = m.color + "06"; }}
          onMouseOut={e => { e.currentTarget.style.borderColor = "#EDE8E2"; e.currentTarget.style.background = "white"; }}
          >
            <span style={{ fontSize: 36 }}>{m.icon}</span>
            <div>
              <div style={{ fontSize: 17, fontWeight: 600, color: "#3A3330" }}>{m.label}</div>
              <div style={{ fontSize: 13, color: "#B0A498", marginTop: 2 }}>{m.desc}</div>
            </div>
            <span style={{ marginLeft: "auto", fontSize: 18, color: "#C4B8AE" }}>→</span>
          </button>
        ))}
      </div>
    </Wrap>
  );
}
