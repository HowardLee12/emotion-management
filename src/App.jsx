import { useState, useEffect } from "react";
import { initLIFF } from "./lib/liff";
import { GlobalStyles } from "./components/ui/SharedUI";
import QuizLanding from "./components/QuizLanding";
import ModeSelector from "./components/ModeSelector";
import QuizPlay from "./components/QuizPlay";
import QuizResult from "./components/QuizResult";
import CompareResult from "./components/CompareResult";
import Onboarding from "./components/Onboarding";
import MainApp from "./components/MainApp";
import EmailModal from "./components/EmailModal";

export default function App() {
  const [phase, setPhase] = useState("landing");
  const [quizMode, setQuizMode] = useState("family");
  const [quizScore, setQuizScore] = useState(0);
  const [familyName, setFamilyName] = useState("");
  const [members, setMembers] = useState([]);
  const [emailOpen, setEmailOpen] = useState(false);

  // Check URL params for compare mode on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const compareMode = params.get("mode");
    const compareScore = params.get("score");

    if (compareMode && compareScore) {
      // Partner is visiting a compare link — go straight to quiz
      setQuizMode(compareMode);
      setPhase("mode");
    }

    // Initialize LIFF (non-blocking)
    initLIFF().catch(() => {
      // LIFF init failed, app works fine without it
    });
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#FBF7F3" }}>
      {phase === "landing" && <QuizLanding onStart={() => setPhase("mode")} />}

      {phase === "mode" && <ModeSelector onSelect={m => { setQuizMode(m); setPhase("quiz"); }} />}

      {phase === "quiz" && <QuizPlay
        mode={quizMode}
        onFinish={score => { setQuizScore(score); setPhase("result"); }}
        onQuit={() => setPhase("landing")}
      />}

      {phase === "result" && <QuizResult
        score={quizScore}
        mode={quizMode}
        onDemo={() => setPhase("onboarding")}
        onCompare={() => setPhase("compare")}
      />}

      {phase === "compare" && <CompareResult
        myScore={quizScore}
        myMode={quizMode}
        onBack={() => setPhase("result")}
        onDemo={() => setPhase("onboarding")}
      />}

      {phase === "onboarding" && <Onboarding onDone={(name, mems) => {
        setFamilyName(name); setMembers(mems); setPhase("app");
      }} />}

      {phase === "app" && <MainApp
        familyName={familyName}
        initMembers={members}
        onSubscribe={() => setEmailOpen(true)}
      />}

      {emailOpen && <EmailModal onClose={() => setEmailOpen(false)} />}

      <GlobalStyles />
    </div>
  );
}
