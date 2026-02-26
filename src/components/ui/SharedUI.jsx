export const Wrap = ({ children, center, anim = "fadeUp" }) => (
  <div style={{
    maxWidth: 480, margin: "0 auto",
    padding: center ? "52px 28px 48px" : "24px 24px 48px",
    textAlign: center ? "center" : "left",
    minHeight: "100vh", position: "relative",
    animation: `${anim} 0.7s ease`,
  }}>
    {children}
  </div>
);

export const Toast = ({ msg }) => msg ? (
  <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, pointerEvents: "none" }}>
    <div style={{ background: "white", borderRadius: 20, padding: "20px 36px", boxShadow: "0 20px 60px rgba(0,0,0,0.12)", fontSize: 18, fontWeight: 600, color: "#D4456A", animation: "pop 0.35s ease" }}>{msg}</div>
  </div>
) : null;

export const Sheet = ({ title, onClose, children }) => (
  <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(58,51,48,0.35)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 100 }} onClick={onClose}>
    <div style={{ background: "#FBF7F3", borderRadius: "28px 28px 0 0", padding: "28px 24px 36px", width: "100%", maxWidth: 480, animation: "sheetUp 0.3s ease" }} onClick={e => e.stopPropagation()}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <span style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 18, fontWeight: 700, color: "#3A3330" }}>{title}</span>
        <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, color: "#C4B8AE", cursor: "pointer" }}>✕</button>
      </div>
      {children}
    </div>
  </div>
);

export const Btn = ({ children, onClick, full, secondary, disabled, small, style: sx }) => (
  <button onClick={disabled ? undefined : onClick} style={{
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
    background: disabled ? "#EDE8E2" : secondary ? "white" : "linear-gradient(135deg, #E8A0BF, #D4456A)",
    color: disabled ? "#C4B8AE" : secondary ? "#6B635C" : "white",
    border: secondary ? "1.5px solid #EDE8E2" : "none",
    borderRadius: small ? 12 : 16,
    padding: small ? "8px 18px" : "16px 44px",
    fontSize: small ? 13 : 17, fontWeight: 600, cursor: disabled ? "default" : "pointer",
    letterSpacing: 0.5, width: full ? "100%" : "auto",
    boxShadow: disabled || secondary ? "none" : "0 8px 28px rgba(212,69,106,0.18)",
    fontFamily: "'Noto Sans TC', sans-serif", transition: "all 0.2s", ...sx,
  }}>
    {children}
  </button>
);

export const Card = ({ children, style: sx }) => (
  <div style={{ background: "white", borderRadius: 18, padding: "18px 20px", boxShadow: "0 2px 12px rgba(0,0,0,0.03)", border: "1px solid #EDE8E2", ...sx }}>{children}</div>
);

export const Chip = ({ children, active, color, onClick }) => (
  <button onClick={onClick} style={{
    border: `1.5px solid ${active ? (color || "#D4456A") + "33" : "#EDE8E2"}`,
    borderRadius: 12, padding: "7px 14px", fontSize: 13, cursor: "pointer",
    fontFamily: "'Noto Sans TC', sans-serif", display: "flex", alignItems: "center", gap: 4,
    background: active ? (color || "#D4456A") + "11" : "white",
    color: active ? (color || "#D4456A") : "#B0A498",
    fontWeight: active ? 600 : 400, transition: "all 0.2s",
  }}>{children}</button>
);

export const SH1 = ({ children }) => (
  <div style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 15, fontWeight: 700, color: "#3A3330" }}>{children}</div>
);

export const inputStyle = {
  width: "100%", padding: "14px 18px", borderRadius: 14,
  border: "1.5px solid #EDE8E2", fontSize: 15, outline: "none",
  boxSizing: "border-box", marginBottom: 16,
  fontFamily: "'Noto Sans TC', sans-serif", background: "white", color: "#3A3330",
};

export const GlobalStyles = () => (
  <style>{`
    @keyframes fadeUp { from { opacity:0; transform:translateY(24px) } to { opacity:1; transform:translateY(0) } }
    @keyframes float { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-8px) } }
    @keyframes glow { 0%,100% { opacity:.4; transform:scale(1) } 50% { opacity:.7; transform:scale(1.05) } }
    @keyframes slideIn { from { opacity:0; transform:translateX(30px) } to { opacity:1; transform:translateX(0) } }
    @keyframes pop { 0% { transform:scale(.5);opacity:0 } 60% { transform:scale(1.1) } 100% { transform:scale(1);opacity:1 } }
    @keyframes sheetUp { from { transform:translateY(100%) } to { transform:translateY(0) } }
    @keyframes pulse { 0%,100% { transform:scale(1) } 50% { transform:scale(1.05) } }
  `}</style>
);
