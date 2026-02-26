import { useState } from "react";
import { QUIZZES, SCORES } from "../data/quizData";
import { Wrap, Card } from "./ui/SharedUI";

export default function QuizPlay({ mode, onFinish, onQuit }) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [sel, setSel] = useState(-1);

  const questions = QUIZZES[mode] || QUIZZES.family;
  const q = questions[idx];
  const progress = ((idx + (sel >= 0 ? 0.5 : 0)) / questions.length) * 100;

  const pick = (i) => {
    if (sel >= 0) return;
    setSel(i);
    setTimeout(() => {
      const next = [...answers, SCORES[i]];
      setAnswers(next);
      if (idx + 1 >= questions.length) {
        onFinish(next.reduce((a, b) => a + b, 0));
      } else {
        setIdx(idx + 1);
        setSel(-1);
      }
    }, 400);
  };

  return (
    <Wrap>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontSize: 13, color: "#B0A498", fontWeight: 500 }}>{idx + 1} / {questions.length}</span>
        <button onClick={onQuit} style={{ background: "none", border: "none", fontSize: 18, color: "#C4B8AE", cursor: "pointer" }}>&times;</button>
      </div>
      <div style={{ height: 5, borderRadius: 3, background: "#EDE8E2", overflow: "hidden", marginBottom: 28 }}>
        <div style={{ height: "100%", borderRadius: 3, background: "linear-gradient(90deg, #E8A0BF, #D4456A)", transition: "width 0.5s", width: `${progress}%` }} />
      </div>
      <Card style={{ textAlign: "center", padding: "36px 24px 32px", marginBottom: 24, animation: "slideIn 0.35s ease", borderRadius: 24 }} key={idx}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, #E8A0BF15, #D4456A10)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
          <span style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 20, fontWeight: 900, color: "#D4456A" }}>Q{idx + 1}</span>
        </div>
        <h2 style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 18, fontWeight: 700, color: "#3A3330", lineHeight: 1.6 }}>{q.q}</h2>
      </Card>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {q.opts.map((o, i) => (
          <button key={i} onClick={() => pick(i)} style={{
            display: "flex", alignItems: "center", gap: 14, width: "100%",
            padding: "15px 18px", borderRadius: 16, fontSize: 14, textAlign: "left",
            lineHeight: 1.5, fontFamily: "'Noto Sans TC', sans-serif", cursor: "pointer",
            transition: "all 0.25s", border: "1.5px solid",
            background: sel === i ? "#D4456A" : "white",
            color: sel === i ? "white" : "#3A3330",
            borderColor: sel === i ? "#D4456A" : "#EDE8E2",
            transform: sel === i ? "scale(0.97)" : "scale(1)",
          }}>
            <span style={{ width: 28, height: 28, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, flexShrink: 0, background: sel === i ? "rgba(255,255,255,0.2)" : "#F5F0EC", color: sel === i ? "white" : "#B0A498" }}>
              {["A","B","C","D"][i]}
            </span>
            <span>{o}</span>
          </button>
        ))}
      </div>
    </Wrap>
  );
}
