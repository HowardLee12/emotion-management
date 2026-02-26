import { Wrap, Btn, Card } from "./ui/SharedUI";

export default function QuizLanding({ onStart }) {
  return (
    <Wrap center>
      <div style={{ position: "absolute", top: -60, left: "50%", transform: "translateX(-50%)", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, #E8A0BF22 0%, transparent 70%)", animation: "glow 4s ease infinite", pointerEvents: "none" }} />
      <div style={{ display: "inline-block", background: "#E8A0BF18", color: "#C4849E", fontSize: 13, fontWeight: 500, padding: "6px 18px", borderRadius: 20, marginBottom: 28, letterSpacing: 1 }}>2 分鐘小測驗</div>
      <h1 style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 36, fontWeight: 900, lineHeight: 1.35, color: "#3A3330", marginBottom: 20 }}>
        你們的<br /><span style={{ background: "linear-gradient(135deg, #E8A0BF, #D4456A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>隱形勞務</span><br />分配健康嗎？
      </h1>
      <p style={{ fontSize: 15, lineHeight: 1.8, color: "#8C8278", marginBottom: 36, fontWeight: 300 }}>
        倒垃圾、記得繳費、補日用品、安撫情緒⋯⋯<br />
        這些「沒有人叫你做，但不做就沒人做」的事，<br />你承擔了多少？
      </p>
      <Card style={{ display: "flex", alignItems: "center", gap: 20, padding: "22px 18px", marginBottom: 36, textAlign: "center" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 32, fontWeight: 900, color: "#D4456A", marginBottom: 6 }}>72%</div>
          <div style={{ fontSize: 11, lineHeight: 1.5, color: "#B0A498" }}>的同住關係中<br />有一方承擔超過 2/3<br />的隱形勞務</div>
        </div>
        <div style={{ width: 1, height: 44, background: "#EDE8E2" }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 32, fontWeight: 900, color: "#D4456A", marginBottom: 6 }}>3x</div>
          <div style={{ fontSize: 11, lineHeight: 1.5, color: "#B0A498" }}>「計劃與協調」的<br />時間差距可達三倍</div>
        </div>
      </Card>
      <Btn full onClick={onStart}>開始測驗</Btn>
      <div style={{ fontSize: 12, color: "#C4B8AE", marginTop: 14, marginBottom: 44 }}>適用於家人 ・ 情侶 ・ 室友 ・ 完全匿名</div>
      <div style={{ fontSize: 14, fontStyle: "italic", color: "#B0A498", lineHeight: 1.8, padding: "22px 0", borderTop: "1px solid #EDE8E2" }}>
        「我不是不願意做，<br />我只是累了——累的是<em>永遠要當那個想到的人。</em>」
      </div>
    </Wrap>
  );
}
