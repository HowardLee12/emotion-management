import { MODES } from "../data/quizData";
import { Wrap } from "./ui/SharedUI";

const MODE_ICONS = {
  family: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4456A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  couple: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#E8A0BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  roommate: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#5B9ECC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
};

export default function ModeSelector({ onSelect }) {
  return (
    <Wrap center anim="fadeUp">
      <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#F5F0EC", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8C8278" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
      </div>
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
            <div style={{ width: 48, height: 48, borderRadius: 14, background: m.color + "0D", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {MODE_ICONS[m.id]}
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 600, color: "#3A3330" }}>{m.label}</div>
              <div style={{ fontSize: 13, color: "#B0A498", marginTop: 2 }}>{m.desc}</div>
            </div>
            <span style={{ marginLeft: "auto", fontSize: 18, color: "#C4B8AE" }}>&rsaquo;</span>
          </button>
        ))}
      </div>
    </Wrap>
  );
}
