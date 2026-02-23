import { useState, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════ */

const CATS = [
  { id: "cook", label: "料理", color: "#E88B3E", icon: "🍳" },
  { id: "clean", label: "清潔", color: "#5B9ECC", icon: "🧹" },
  { id: "kids", label: "育兒", color: "#D4456A", icon: "🧒" },
  { id: "errands", label: "跑腿", color: "#5BA86C", icon: "📦" },
  { id: "mental", label: "腦力", color: "#9B7DC4", icon: "🧠" },
  { id: "emotional", label: "情感", color: "#D4A843", icon: "💛" },
];

const MODES = [
  { id: "family", label: "家人", icon: "👨‍👩‍👧", desc: "和家人同住", color: "#D4456A" },
  { id: "couple", label: "情侶", icon: "💑", desc: "和另一半同居", color: "#E8A0BF" },
  { id: "roommate", label: "合租", icon: "🏠", desc: "和室友同住", color: "#5B9ECC" },
];

const QUIZZES = {
  family: [
    { q: "家裡的衛生紙、洗衣精快用完了，通常是誰先注意到？", icon: "🧻", opts: ["幾乎都是我", "大多是我", "差不多各半", "其他家人比較常注意"] },
    { q: "小孩（或寵物）下次看醫生的時間，誰記在腦裡？", icon: "🏥", opts: ["一定是我", "我記得並提醒家人", "會一起記在行事曆", "其他家人會主動追蹤"] },
    { q: "過年過節準備禮物、訂餐廳、安排行程，誰在規劃？", icon: "🎁", opts: ["從頭到尾都是我", "我規劃，家人執行部分", "一起討論分工", "其他家人會主動張羅"] },
    { q: "有人說「你叫我做什麼我就做」，你的感受是？", icon: "😮‍💨", opts: ["很累，「想到要做什麼」才最累", "有點無奈，但至少願意做", "還好，有固定分工", "家人會主動看到需要做的事"] },
    { q: "半夜小孩哭了／寵物吐了，誰先醒來處理？", icon: "🌙", opts: ["永遠是我", "通常我先醒", "我們會輪流", "其他家人警覺性比我高"] },
    { q: "帳單繳費、保險到期、證件更新，誰在追蹤？", icon: "📋", opts: ["全部在我腦裡", "大部分我處理", "有明確分工", "其他家人比較擅長這些"] },
    { q: "你多常覺得「每個人都在等我安排一切」？", icon: "🫠", opts: ["幾乎每天", "一週好幾次", "偶爾", "很少"] },
    { q: "安撫情緒、維繫親友關係，主要是誰在做？", icon: "💛", opts: ["都是我，沒人注意到", "主要是我", "各有擅長部分", "其他家人很細心"] },
    { q: "你曾因「沒人注意到你的付出」而感到委屈嗎？", icon: "🥲", opts: ["經常", "特別累的時候會", "偶爾，但能溝通", "很少，家人會感謝"] },
    { q: "如果你消失一週，家裡會發生什麼事？", icon: "🏝️", opts: ["一切崩潰", "很混亂但勉強撐過", "有點不順但大致OK", "可以運轉得很好"] },
  ],
  couple: [
    { q: "家裡日用品快沒了（衛生紙、洗碗精等），通常誰先發現？", icon: "🧻", opts: ["幾乎都是我", "大多是我", "差不多各半", "對方比較常注意"] },
    { q: "你們的紀念日、對方爸媽生日，誰在記？", icon: "🎂", opts: ["全部在我腦裡", "我記得並提醒對方", "會一起記在行事曆", "對方記得比我清楚"] },
    { q: "約會、旅行、假日行程，通常誰在規劃？", icon: "✈️", opts: ["從頭到尾都是我", "我提案，對方配合", "一起討論", "對方會主動安排"] },
    { q: "對方說「你想去哪就去哪」「你決定就好」，你的感受是？", icon: "😮‍💨", opts: ["很累，每次都要我決定", "有點無奈，但習慣了", "還好，重要的事會一起討論", "對方不會這樣，會主動提意見"] },
    { q: "家裡要打掃、洗衣服、倒垃圾，誰先動手？", icon: "🧹", opts: ["永遠是我先做", "通常是我，偶爾對方會", "差不多輪流", "對方比我勤快"] },
    { q: "繳房租、水電帳單、網路費，誰在追蹤？", icon: "📋", opts: ["全部我在處理", "大部分我，少數對方", "有明確分工", "對方比較擅長這些"] },
    { q: "你多常覺得「這段關係裡我比較操心」？", icon: "🫠", opts: ["幾乎每天", "一週好幾次", "偶爾", "很少"] },
    { q: "對方心情不好的時候，誰在安撫和傾聽？", icon: "💛", opts: ["都是我在顧對方情緒", "主要是我", "互相會關心", "對方也很會照顧我情緒"] },
    { q: "你曾覺得自己付出很多但對方沒注意到嗎？", icon: "🥲", opts: ["經常", "有時候，尤其是累的時候", "偶爾，但說了對方會理解", "很少，對方會表達感謝"] },
    { q: "如果你一週不做任何家事和規劃，會怎樣？", icon: "🏝️", opts: ["家裡會變災難現場", "很混亂但對方勉強能撐", "有點不順但大致OK", "對方可以自己打理好"] },
  ],
  roommate: [
    { q: "公共空間的衛生紙、垃圾袋沒了，通常誰去補？", icon: "🧻", opts: ["幾乎都是我", "大多是我", "會輪流或分攤", "室友比較主動"] },
    { q: "房租、水電、網路費到期，誰在追蹤和催繳？", icon: "💰", opts: ["全部我在處理", "大部分是我提醒大家", "有人負責記帳", "室友會主動繳"] },
    { q: "公共區域（客廳、廚房、浴室）誰在維持整潔？", icon: "🧹", opts: ["幾乎都是我在打掃", "主要是我，室友偶爾幫忙", "有排班或輪流", "室友比我愛乾淨"] },
    { q: "冰箱裡東西過期、水槽堆碗盤，誰先處理？", icon: "🍽️", opts: ["永遠是我受不了先動手", "通常是我，但會碎唸", "會互相提醒", "室友會自己處理"] },
    { q: "有訪客來、要收包裹、跟房東溝通，誰在對外聯繫？", icon: "📱", opts: ["都是我在處理", "大部分是我", "看誰有空", "室友會主動處理"] },
    { q: "室友做了讓你不舒服的事，通常怎麼處理？", icon: "😤", opts: ["我忍著不說，自己消化", "我會暗示但不直說", "會直接溝通", "室友很有sense不太需要講"] },
    { q: "你多常覺得「這個家只有我在管」？", icon: "🫠", opts: ["幾乎每天", "一週好幾次", "偶爾", "很少"] },
    { q: "搬進來的時候，添購生活用品和佈置，誰出力最多？", icon: "📦", opts: ["幾乎都是我張羅", "主要是我，室友出一些錢", "大家一起分擔", "室友比我積極"] },
    { q: "你覺得室友有注意到你為這個空間做的事嗎？", icon: "🥲", opts: ["完全沒有", "偶爾會提到", "有時候會說謝謝", "室友經常表達感謝"] },
    { q: "如果你一週完全不管公共事務，會怎樣？", icon: "🏝️", opts: ["整個家會髒到崩潰", "會變很亂但勉強能住", "有點不方便但還好", "室友可以維持運作"] },
  ],
};

const SCORES = [3, 2, 1, 0]; // per option index

function getResult(score, mode) {
  const pct = Math.round((score / 30) * 100);

  const labels = {
    family: { high: "家庭隱形 CEO", mid: "家庭主要操心者", low: "分工意識不錯", good: "模範家庭分工", unit: "家庭", other: "家人" },
    couple: { high: "感情裡的隱形 CEO", mid: "關係中的主要操心者", low: "分工還算平衡", good: "模範情侶分工", unit: "這段關係", other: "另一半" },
    roommate: { high: "合租界的隱形 CEO", mid: "宿舍的主要操心者", low: "室友分工還行", good: "模範室友分工", unit: "這個家", other: "室友" },
  };
  const L = labels[mode] || labels.family;

  if (pct >= 80) return { pct, level: "嚴重超載", color: "#D4456A", title: `你是${L.unit}的「${L.high}」`, desc: `你承擔了絕大部分的心理負擔和隱形勞務。這不只是「比較操心」，而是長期處於沒人看見的高壓狀態。你值得被看見，也值得被分擔。`, advice: `建議先從「列出所有你在做的隱形工作」開始，讓${L.other}真正理解這份清單有多長。` };
  if (pct >= 60) return { pct, level: "明顯失衡", color: "#E88B3E", title: "你扛的比你以為的還多", desc: `你承擔了大部分的規劃、記憶和協調工作。${L.other}有參與，但「想到要做什麼」主要還是落在你身上。`, advice: `試著把「腦力勞動」——規劃、追蹤、提醒——也列入分工討論，不只是看得見的體力活。` };
  if (pct >= 35) return { pct, level: "略有不均", color: "#D4A843", title: "還不錯，但有進步空間", desc: `你們的分工有一定基礎，但某些隱形勞務可能還是比較集中在你身上。好消息是，你們已經有溝通的基礎。`, advice: "定期做一次「分工盤點」，確認大家對負擔的感受一致。" };
  return { pct, level: "相當均衡", color: "#5BA86C", title: `你們的分工很健康！`, desc: `你們建立了相對均衡的勞務分工，代表你們有良好的溝通和相互尊重。`, advice: "持續保持開放的對話，隨著生活變化適時調整。" };
}

const SAMPLE_TASKS = [
  { id: 1, title: "預約小孩牙醫", cat: "mental", who: 0, done: false, pts: 15, due: "本週五" },
  { id: 2, title: "採買一週食材", cat: "errands", who: 0, done: false, pts: 20, due: "明天" },
  { id: 3, title: "洗衣服＋曬衣服", cat: "clean", who: 1, done: false, pts: 10, due: "今天" },
  { id: 4, title: "煮晚餐", cat: "cook", who: 0, done: false, pts: 15, due: "今天" },
  { id: 5, title: "陪小孩複習功課", cat: "kids", who: 1, done: false, pts: 20, due: "今天" },
  { id: 6, title: "打電話關心婆婆", cat: "emotional", who: 0, done: false, pts: 10, due: "週日" },
  { id: 7, title: "繳信用卡帳單", cat: "mental", who: 0, done: true, pts: 10, due: "已完成" },
  { id: 8, title: "記錄家庭預算", cat: "mental", who: 0, done: true, pts: 15, due: "已完成" },
  { id: 9, title: "接送小孩上才藝班", cat: "kids", who: 1, done: true, pts: 12, due: "已完成" },
];

const REWARDS = [
  { id: 1, title: "一個人的咖啡時光", icon: "☕", desc: "兌換 2 小時完全自由時間", cost: 200 },
  { id: 2, title: "全家電影之夜", icon: "🎬", desc: "一起挑電影窩在沙發", cost: 500 },
  { id: 3, title: "媽媽放風日", icon: "💆‍♀️", desc: "整天由其他家人接手", cost: 800 },
  { id: 4, title: "家庭旅遊基金", icon: "🏖️", desc: "存入旅遊基金 $500", cost: 1500 },
];

/* ═══════════════════════════════════════════════════════
   SHARED UI
   ═══════════════════════════════════════════════════════ */

const Wrap = ({ children, center, anim = "fadeUp" }) => (
  <div style={{ maxWidth: 480, margin: "0 auto", padding: center ? "52px 28px 48px" : "24px 24px 48px", textAlign: center ? "center" : "left", minHeight: "100vh", position: "relative", animation: `${anim} 0.7s ease` }}>
    {children}
  </div>
);

const Toast = ({ msg }) => msg ? (
  <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, pointerEvents: "none" }}>
    <div style={{ background: "white", borderRadius: 20, padding: "20px 36px", boxShadow: "0 20px 60px rgba(0,0,0,0.12)", fontSize: 18, fontWeight: 600, color: "#D4456A", animation: "pop 0.35s ease" }}>{msg}</div>
  </div>
) : null;

const Sheet = ({ title, onClose, children }) => (
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

const Btn = ({ children, onClick, full, secondary, disabled, small, style: sx }) => (
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

const Card = ({ children, style: sx }) => (
  <div style={{ background: "white", borderRadius: 18, padding: "18px 20px", boxShadow: "0 2px 12px rgba(0,0,0,0.03)", border: "1px solid #EDE8E2", ...sx }}>{children}</div>
);

const Chip = ({ children, active, color, onClick }) => (
  <button onClick={onClick} style={{
    border: `1.5px solid ${active ? (color || "#D4456A") + "33" : "#EDE8E2"}`,
    borderRadius: 12, padding: "7px 14px", fontSize: 13, cursor: "pointer",
    fontFamily: "'Noto Sans TC', sans-serif", display: "flex", alignItems: "center", gap: 4,
    background: active ? (color || "#D4456A") + "11" : "white",
    color: active ? (color || "#D4456A") : "#B0A498",
    fontWeight: active ? 600 : 400, transition: "all 0.2s",
  }}>{children}</button>
);

const SH1 = ({ children }) => <div style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 15, fontWeight: 700, color: "#3A3330" }}>{children}</div>;

/* ═══════════════════════════════════════════════════════
   1. QUIZ LANDING
   ═══════════════════════════════════════════════════════ */

function QuizLanding({ onStart }) {
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
      <Btn full onClick={onStart}>開始測驗 →</Btn>
      <div style={{ fontSize: 12, color: "#C4B8AE", marginTop: 14, marginBottom: 44 }}>適用於家人 ・ 情侶 ・ 室友 ・ 完全匿名</div>
      <div style={{ fontSize: 14, fontStyle: "italic", color: "#B0A498", lineHeight: 1.8, padding: "22px 0", borderTop: "1px solid #EDE8E2" }}>
        「我不是不願意做，<br />我只是累了——累的是<em>永遠要當那個想到的人。</em>」
      </div>
    </Wrap>
  );
}

/* ═══════════════════════════════════════════════════════
   1.5 MODE SELECTOR
   ═══════════════════════════════════════════════════════ */

function ModeSelector({ onSelect }) {
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

/* ═══════════════════════════════════════════════════════
   2. QUIZ QUESTIONS
   ═══════════════════════════════════════════════════════ */

function QuizPlay({ mode, onFinish, onQuit }) {
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
        <button onClick={onQuit} style={{ background: "none", border: "none", fontSize: 18, color: "#C4B8AE", cursor: "pointer" }}>✕</button>
      </div>
      <div style={{ height: 5, borderRadius: 3, background: "#EDE8E2", overflow: "hidden", marginBottom: 28 }}>
        <div style={{ height: "100%", borderRadius: 3, background: "linear-gradient(90deg, #E8A0BF, #D4456A)", transition: "width 0.5s", width: `${progress}%` }} />
      </div>
      <Card style={{ textAlign: "center", padding: "32px 24px 28px", marginBottom: 24, animation: "slideIn 0.35s ease", borderRadius: 24 }} key={idx}>
        <div style={{ fontSize: 40, marginBottom: 14, animation: "float 3s ease infinite" }}>{q.icon}</div>
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

/* ═══════════════════════════════════════════════════════
   3. QUIZ RESULT
   ═══════════════════════════════════════════════════════ */

function QuizResult({ score, mode, onDemo }) {
  const r = getResult(score, mode);
  const modeLabel = MODES.find(m => m.id === mode)?.label || "家人";
  const [count, setCount] = useState(0);
  const [show, setShow] = useState(false);
  const siteUrl = typeof window !== "undefined" ? window.location.href.split("?")[0] : "";
  const shareText = `我剛測了「${modeLabel}隱形勞務指數」，結果是 ${r.pct}%（${r.level}）😳 你也來測測看👉`;
  const lineShareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(siteUrl)}&text=${encodeURIComponent(shareText)}`;

  useEffect(() => {
    let f = 0;
    const t = setInterval(() => {
      f++;
      setCount(Math.round((f / 40) * r.pct));
      if (f >= 40) { setCount(r.pct); clearInterval(t); setTimeout(() => setShow(true), 300); }
    }, 28);
    return () => clearInterval(t);
  }, [r.pct]);


  return (
    <Wrap>
      {/* Result Card — designed for screenshot sharing */}
      <div style={{ background: `${r.color}08`, borderRadius: 28, padding: "36px 28px 20px", textAlign: "center", boxShadow: "0 8px 40px rgba(0,0,0,0.05)", marginBottom: 8, border: `1px solid ${r.color}15` }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: "#B0A498", letterSpacing: 2, marginBottom: 20 }}>{modeLabel}隱形勞務指數</div>
        <div style={{ position: "relative", width: 200, height: 120, margin: "0 auto 8px" }}>
          <svg width="200" height="120" viewBox="0 0 200 120">
            <path d="M 20 110 A 80 80 0 0 1 180 110" fill="none" stroke="#EDE8E2" strokeWidth="12" strokeLinecap="round" />
            <path d="M 20 110 A 80 80 0 0 1 180 110" fill="none" stroke={r.color} strokeWidth="12" strokeLinecap="round" strokeDasharray={`${(count / 100) * 251.2} 251.2`} style={{ transition: "stroke-dasharray 0.3s" }} />
          </svg>
          <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", textAlign: "center" }}>
            <div style={{ fontFamily: "'Noto Serif TC', serif", fontSize: count >= 100 ? 36 : 44, fontWeight: 900, color: r.color, lineHeight: 1 }}>{count}%</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: "#8C8278", marginTop: 4 }}>{r.level}</div>
          </div>
        </div>
        <h2 style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 22, fontWeight: 700, color: "#3A3330", marginTop: 20, marginBottom: 10 }}>{r.title}</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: "#7A736C", marginBottom: 20 }}>{r.desc}</p>
        <div style={{ display: "flex", gap: 12, textAlign: "left", padding: "14px 16px", background: "white", borderRadius: 16, border: `1px solid ${r.color}22` }}>
          <div style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>💡</div>
          <div style={{ fontSize: 13, lineHeight: 1.7, color: "#6B635C" }}>{r.advice}</div>
        </div>
      </div>

      {/* Screenshot hint */}
      <div style={{ textAlign: "center", padding: "10px 0 20px", fontSize: 12, color: "#C4B8AE" }}>
        📱 截圖就能分享到限動 / 群組
      </div>

      {/* Share buttons */}
      <div style={{ opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(20px)", transition: "all 0.5s" }}>

        {/* LINE share - most important for Taiwan */}
        <a href={lineShareUrl} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "14px", background: "#06C755", color: "white", borderRadius: 16, fontSize: 15, fontWeight: 600, textDecoration: "none", marginBottom: 10, fontFamily: "'Noto Sans TC', sans-serif", boxShadow: "0 4px 16px rgba(6,199,85,0.2)" }}>
          <span style={{ fontSize: 20 }}>💬</span> 用 LINE 分享給{mode === "roommate" ? "室友" : mode === "couple" ? "另一半" : "家人"}
        </a>

        <Btn full onClick={onDemo} style={{ marginBottom: 10 }}>🏠 免費試玩「家務分擔」工具 →</Btn>
        <div style={{ fontSize: 12, color: "#C4B8AE", textAlign: "center", marginBottom: 20 }}>不用註冊，立即體驗完整功能</div>

      </div>
    </Wrap>
  );
}

/* ═══════════════════════════════════════════════════════
   4. ONBOARDING
   ═══════════════════════════════════════════════════════ */

function Onboarding({ onDone }) {
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

/* ═══════════════════════════════════════════════════════
   5. MAIN APP
   ═══════════════════════════════════════════════════════ */

function MainApp({ familyName, initMembers, onSubscribe }) {
  const [tab, setTab] = useState("home");
  const [members, setMembers] = useState(initMembers);
  const [tasks, setTasks] = useState(SAMPLE_TASKS.map((t, i) => ({ ...t, who: i % initMembers.length })));
  const [toast, setToast] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [showCTA, setShowCTA] = useState(false);

  const flash = useCallback(msg => { setToast(msg); setTimeout(() => setToast(null), 2000); }, []);
  const totalPts = members.reduce((s, m) => s + m.points, 0);

  // Show CTA after some interactions
  const [interactions, setInteractions] = useState(0);
  useEffect(() => { if (interactions >= 4 && !showCTA) setShowCTA(true); }, [interactions, showCTA]);

  const toggle = (id) => {
    setTasks(ts => ts.map(t => {
      if (t.id !== id) return t;
      if (!t.done) {
        setMembers(ms => ms.map((m, i) => i === t.who ? { ...m, points: m.points + t.pts, streak: m.streak + 1 } : m));
        flash(`+${t.pts} 💛 做得好！`);
        setInteractions(n => n + 1);
      } else {
        setMembers(ms => ms.map((m, i) => i === t.who ? { ...m, points: Math.max(0, m.points - t.pts) } : m));
      }
      return { ...t, done: !t.done, due: !t.done ? "已完成" : "今天" };
    }));
  };

  const reassign = (id) => {
    setTasks(ts => ts.map(t => t.id === id ? { ...t, who: (t.who + 1) % members.length } : t));
    setInteractions(n => n + 1);
  };

  const addTask = (form) => {
    setTasks(ts => [{ id: Date.now(), ...form, done: false, due: "待安排" }, ...ts]);
    flash("✨ 新任務已加入！");
    setInteractions(n => n + 1);
  };

  const redeem = (cost) => {
    if (totalPts < cost) return flash("❌ 點數不足");
    let rem = cost;
    setMembers(ms => {
      const s = [...ms].sort((a, b) => b.points - a.points);
      const deductions = {};
      for (const m of s) { const idx = ms.indexOf(m); const d = Math.min(m.points, rem); deductions[idx] = d; rem -= d; if (rem <= 0) break; }
      return ms.map((m, i) => ({ ...m, points: m.points - (deductions[i] || 0) }));
    });
    flash("🎉 兌換成功！");
  };

  const pending = tasks.filter(t => !t.done);
  const done = tasks.filter(t => t.done);
  const shown = filter === "all" ? pending : pending.filter(t => t.cat === filter);
  const bData = members.map((m, i) => ({ ...m, idx: i, count: pending.filter(t => t.who === i).length }));
  const bMax = Math.max(...bData.map(d => d.count), 1);
  const bAll = bData.reduce((s, d) => s + d.count, 0);

  const navItems = [
    { key: "home", icon: "🏠", label: "首頁" },
    { key: "miles", icon: "🏅", label: "里程碑" },
    { key: "rewards", icon: "🎁", label: "獎勵" },
  ];

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", position: "relative" }}>
      <Toast msg={toast} />

      {/* Header */}
      <div style={{ padding: "20px 20px 16px", background: "linear-gradient(180deg, #F5ECEC 0%, #FBF7F3 100%)", borderRadius: "0 0 28px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 22, fontWeight: 700, color: "#3A3330" }}>🏠 {familyName}</div>
            <div style={{ fontSize: 12, color: "#B0A498", marginTop: 2 }}>一起分擔，一起成長 🌱</div>
          </div>
          <div style={{ background: "white", borderRadius: 16, padding: "8px 14px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: 10, color: "#B0A498" }}>家庭愛心</div>
            <div style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 18, fontWeight: 700, color: "#D4A843" }}>💛 {totalPts}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          {members.map((m, i) => (
            <div key={i} style={{ flex: 1, background: "white", borderRadius: 14, padding: "10px 6px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
              <div style={{ fontSize: 24 }}>{m.emoji}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#6B635C", marginTop: 2 }}>{m.name}</div>
              <div style={{ fontSize: 11, color: m.color, fontWeight: 500 }}>🔥 {m.streak}</div>
              <div style={{ fontSize: 10, color: "#C4B8AE" }}>{m.points} pts</div>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "16px 20px", paddingBottom: 100 }}>

        {/* ── HOME ── */}
        {tab === "home" && <>
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <SH1>⚖️ 本週負擔分佈</SH1>
              {bData.length >= 2 && bData[0].count > bData[1].count * 1.8 && bData[1].count > 0 && (
                <span style={{ fontSize: 11, background: "#FFF3E0", color: "#E88B3E", padding: "4px 12px", borderRadius: 20, fontWeight: 500 }}>⚠️ 分配不均</span>
              )}
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end", height: 76 }}>
              {bData.map((d, i) => (
                <div key={i} style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontSize: 12, color: "#B0A498", marginBottom: 4 }}>{d.count} 項</div>
                  <div style={{ height: Math.max((d.count / bMax) * 50, 6), background: `linear-gradient(180deg, ${d.color}, ${d.color}66)`, borderRadius: "8px 8px 4px 4px", transition: "height 0.5s", margin: "0 auto", width: "65%" }} />
                  <div style={{ marginTop: 6, fontSize: 12, fontWeight: 500, color: "#6B635C" }}>{d.emoji} {d.name}</div>
                </div>
              ))}
            </div>
            {bAll > 0 && <div style={{ marginTop: 12, height: 6, borderRadius: 3, background: "#EDE8E2", display: "flex", overflow: "hidden" }}>
              {bData.map((d, i) => <div key={i} style={{ width: `${(d.count / bAll) * 100}%`, background: d.color, transition: "width 0.5s" }} />)}
            </div>}
          </Card>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24, marginBottom: 12 }}>
            <SH1>📋 待辦事項 ({shown.length})</SH1>
            <Btn small onClick={() => setAddOpen(true)}>+ 新增</Btn>
          </div>

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
            <Chip active={filter === "all"} onClick={() => setFilter("all")}>全部</Chip>
            {CATS.map(c => <Chip key={c.id} active={filter === c.id} color={c.color} onClick={() => setFilter(c.id)}>{c.icon}</Chip>)}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {shown.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#C4B8AE" }}>🎉 沒有待辦事項！</div>}
            {shown.map(t => {
              const m = members[t.who]; const c = CATS.find(x => x.id === t.cat);
              return (
                <Card key={t.id} style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                  <button onClick={() => toggle(t.id)} style={{ width: 26, height: 26, borderRadius: "50%", border: t.done ? "none" : `2px solid ${c?.color}`, background: t.done ? c?.color : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "white", flexShrink: 0 }}>{t.done && "✓"}</button>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: t.done ? "#C4B8AE" : "#3A3330", textDecoration: t.done ? "line-through" : "none" }}>{t.title}</div>
                    <div style={{ display: "flex", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11, background: `${c?.color}11`, color: c?.color, padding: "2px 8px", borderRadius: 8, fontWeight: 500 }}>{c?.icon} {c?.label}</span>
                      <span style={{ fontSize: 11, color: "#C4B8AE" }}>{t.due}</span>
                      <span style={{ fontSize: 11, color: "#D4A843", fontWeight: 500 }}>+{t.pts} 💛</span>
                    </div>
                  </div>
                  <button onClick={() => reassign(t.id)} style={{ background: `${m?.color}11`, border: `1px solid ${m?.color}22`, borderRadius: 12, padding: "4px 10px", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
                    {m?.emoji}<span style={{ fontSize: 11, color: "#8C8278" }}>{m?.name}</span>
                  </button>
                </Card>
              );
            })}
          </div>

          {done.length > 0 && <>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#C4B8AE", marginTop: 24, marginBottom: 8 }}>✅ 已完成 ({done.length})</div>
            {done.map(t => {
              const m = members[t.who]; const c = CATS.find(x => x.id === t.cat);
              return (
                <Card key={t.id} style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, opacity: 0.5, background: "#F5F0EC", marginBottom: 6 }}>
                  <button onClick={() => toggle(t.id)} style={{ width: 24, height: 24, borderRadius: "50%", border: "none", background: c?.color, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "white", flexShrink: 0 }}>✓</button>
                  <div style={{ flex: 1, fontSize: 13, color: "#B0A498", textDecoration: "line-through" }}>{t.title}</div>
                  <span style={{ fontSize: 12 }}>{m?.emoji}</span>
                </Card>
              );
            })}
          </>}

          {addOpen && <Sheet title="✨ 新增任務" onClose={() => setAddOpen(false)}>
            <AddForm members={members} onAdd={t => { addTask(t); setAddOpen(false); }} />
          </Sheet>}
        </>}

        {/* ── MILESTONES ── */}
        {tab === "miles" && <>
          <SH1 style={{ marginBottom: 14 }}>🏅 家庭里程碑</SH1>
          {(() => {
            const maxStreak = Math.max(...members.map(m => m.streak), 0);
            const ms = [
              { t: "🌸 連續 7 天全家協作", ok: maxStreak >= 7, p: Math.min(100, Math.round((maxStreak/7)*100)) },
              { t: "🏆 完成 10 項任務", ok: done.length >= 10, p: Math.min(100, Math.round((done.length/10)*100)) },
              { t: "💎 累積 2000 愛心點數", ok: totalPts >= 2000, p: Math.min(100, Math.round((totalPts/2000)*100)) },
              { t: "🌈 連續 30 天不中斷", ok: maxStreak >= 30, p: Math.min(100, Math.round((maxStreak/30)*100)) },
            ];
            return <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {ms.map((m, i) => (
                <Card key={i} style={{ border: m.ok ? "1px solid #D4A84333" : undefined, opacity: m.ok ? 1 : 0.7 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{m.t}</span>
                    {m.ok ? <span style={{ fontSize: 12, color: "#D4A843" }}>🎉 達成</span> : <span style={{ fontSize: 12, color: "#C4B8AE" }}>🔒</span>}
                  </div>
                  {!m.ok && <div style={{ marginTop: 8, height: 5, background: "#EDE8E2", borderRadius: 3, overflow: "hidden" }}><div style={{ height: "100%", width: `${m.p}%`, background: "linear-gradient(90deg, #E8A0BF, #D4A843)", borderRadius: 3, transition: "width 0.5s" }} /></div>}
                </Card>
              ))}
            </div>;
          })()}

          <div style={{ marginTop: 32 }}><SH1>📊 數據洞察</SH1></div>
          <Card style={{ marginTop: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {members.map((m, i) => {
                const cnt = done.filter(t => t.who === i).length;
                const pct = done.length > 0 ? Math.round((cnt / done.length) * 100) : 0;
                return <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 30, fontWeight: 900, color: m.color }}>{pct}%</div>
                  <div style={{ fontSize: 12, color: "#8C8278", marginTop: 2 }}>{m.emoji} {m.name}</div>
                </div>;
              })}
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 30, fontWeight: 900, color: "#9B7DC4" }}>{done.length}</div>
                <div style={{ fontSize: 12, color: "#8C8278" }}>已完成</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 30, fontWeight: 900, color: "#D4A843" }}>{Math.max(...members.map(m => m.streak), 0)}</div>
                <div style={{ fontSize: 12, color: "#8C8278" }}>最長連續</div>
              </div>
            </div>
          </Card>
        </>}

        {/* ── REWARDS ── */}
        {tab === "rewards" && <>
          <div style={{ background: "linear-gradient(135deg, #D4A84312, #E8A0BF08)", borderRadius: 24, padding: "28px 24px", textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 13, color: "#B0A498" }}>家庭共同點數</div>
            <div style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 42, fontWeight: 900, color: "#D4A843", marginTop: 4 }}>💛 {totalPts}</div>
          </div>
          <SH1>🎁 獎勵兌換</SH1>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
            {REWARDS.map(r => {
              const ok = totalPts >= r.cost;
              return <Card key={r.id} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ fontSize: 28, width: 40, textAlign: "center", flexShrink: 0 }}>{r.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#3A3330" }}>{r.title}</div>
                  <div style={{ fontSize: 12, color: "#B0A498", marginTop: 2 }}>{r.desc}</div>
                </div>
                <Btn small disabled={!ok} onClick={() => redeem(r.cost)} style={{ background: ok ? "linear-gradient(135deg, #D4A843, #E88B3E)" : "#EDE8E2", boxShadow: "none" }}>{r.cost} 💛</Btn>
              </Card>;
            })}
          </div>
          <div style={{ marginTop: 32 }}><SH1>✨ 個人排行</SH1></div>
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
            {[...members].sort((a, b) => b.points - a.points).map((m, i) => (
              <Card key={i} style={{ display: "flex", alignItems: "center", gap: 12, border: i === 0 ? "1px solid #D4A84333" : undefined }}>
                <span style={{ fontSize: 20, width: 28, textAlign: "center" }}>{["🥇","🥈","🥉"][i] || ""}</span>
                <span style={{ fontSize: 26 }}>{m.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#3A3330" }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: "#B0A498" }}>🔥 {m.streak} 天</div>
                </div>
                <div style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 18, fontWeight: 700, color: m.color }}>{m.points}</div>
              </Card>
            ))}
          </div>
        </>}
      </div>

      {/* CTA Banner */}
      {showCTA && (
        <div style={{ position: "fixed", bottom: 68, left: "50%", transform: "translateX(-50%)", width: "calc(100% - 40px)", maxWidth: 440, zIndex: 60, animation: "sheetUp 0.4s ease" }}>
          <Card style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)", border: "1px solid #E8A0BF33" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#3A3330" }}>免費領《分工溝通指南》📖</div>
              <div style={{ fontSize: 12, color: "#8C8278", marginTop: 2 }}>5 個不吵架的對話範本</div>
            </div>
            <Btn small onClick={onSubscribe}>免費領取</Btn>
            <button onClick={() => setShowCTA(false)} style={{ background: "none", border: "none", color: "#C4B8AE", cursor: "pointer", fontSize: 14 }}>✕</button>
          </Card>
        </div>
      )}

      {/* Bottom Nav */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "#FBF7F3", borderTop: "1px solid #EDE8E2", display: "flex", padding: "8px 0 14px", zIndex: 50 }}>
        {navItems.map(n => (
          <button key={n.key} onClick={() => setTab(n.key)} style={{ flex: 1, border: "none", background: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, fontFamily: "'Noto Sans TC', sans-serif", padding: "6px 0", color: tab === n.key ? "#D4456A" : "#C4B8AE", fontWeight: tab === n.key ? 600 : 400 }}>
            <span style={{ fontSize: 20, lineHeight: 1 }}>{n.icon}</span>
            <span style={{ fontSize: 11 }}>{n.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function AddForm({ members, onAdd }) {
  const [f, setF] = useState({ title: "", cat: "cook", who: 0, pts: 10 });
  return <>
    <input value={f.title} onChange={e => setF(x => ({...x, title: e.target.value}))} placeholder="輸入任務名稱..." style={inputStyle} autoFocus />
    <div style={{ fontSize: 13, color: "#8C8278", marginBottom: 8, fontWeight: 500 }}>類別</div>
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
      {CATS.map(c => <Chip key={c.id} active={f.cat === c.id} color={c.color} onClick={() => setF(x => ({...x, cat: c.id}))}>{c.icon} {c.label}</Chip>)}
    </div>
    <div style={{ fontSize: 13, color: "#8C8278", marginBottom: 8, fontWeight: 500 }}>指派給</div>
    <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
      {members.map((m, i) => (
        <button key={i} onClick={() => setF(x => ({...x, who: i}))} style={{ flex: 1, padding: "12px 8px", borderRadius: 14, border: f.who === i ? `2px solid ${m.color}` : "1.5px solid #EDE8E2", background: f.who === i ? `${m.color}08` : "white", cursor: "pointer", textAlign: "center", fontFamily: "'Noto Sans TC', sans-serif" }}>
          <div style={{ fontSize: 22 }}>{m.emoji}</div>
          <div style={{ marginTop: 4, fontSize: 13, color: f.who === i ? m.color : "#8C8278", fontWeight: f.who === i ? 600 : 400 }}>{m.name}</div>
        </button>
      ))}
    </div>
    <div style={{ fontSize: 13, color: "#8C8278", marginBottom: 8, fontWeight: 500 }}>點數</div>
    <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
      {[5,10,15,20].map(p => <Chip key={p} active={f.pts === p} color="#D4A843" onClick={() => setF(x => ({...x, pts: p}))}>{p} 💛</Chip>)}
    </div>
    <Btn full onClick={() => f.title.trim() && onAdd(f)}>確認新增</Btn>
  </>;
}

/* ═══════════════════════════════════════════════════════
   6. EMAIL COLLECTION MODAL
   ═══════════════════════════════════════════════════════ */

function EmailModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | done | error

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
    <Sheet title="🎉 領取成功！" onClose={onClose}>
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📖</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: "#3A3330", marginBottom: 8 }}>指南已準備好！</div>
        <div style={{ fontSize: 14, color: "#8C8278", lineHeight: 1.7 }}>我們會盡快將《家庭分工溝通指南》<br />寄到你的信箱。<br /><br />同時，正式版工具上線時<br />也會第一時間通知你 ✨</div>
      </div>
      <Btn full onClick={onClose}>好的，期待收到！</Btn>
    </Sheet>
  );

  return (
    <Sheet title="📖 免費領取《溝通指南》" onClose={onClose}>
      <div style={{ background: "#F5F0EC", borderRadius: 14, padding: "16px", marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#3A3330", marginBottom: 8 }}>指南內容包含：</div>
        <div style={{ fontSize: 13, color: "#6B635C", lineHeight: 1.8 }}>
          ✅ 5 個「不吵架」的分工對話範本<br/>
          ✅ 隱形勞務盤點清單（可列印）<br/>
          ✅ 如何讓同住的人「看見」你的付出<br/>
          ✅ 從今天開始的 3 個小改變
        </div>
      </div>
      <input value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} type="email" placeholder="your@email.com" style={inputStyle} autoFocus />
      {status === "error" && <div style={{ fontSize: 13, color: "#D4456A", marginBottom: 12 }}>⚠️ 發生錯誤，請稍後再試</div>}
      <Btn full onClick={submit} disabled={status === "loading"}>
        {status === "loading" ? "送出中..." : "免費領取 →"}
      </Btn>
      <div style={{ fontSize: 12, color: "#C4B8AE", textAlign: "center", marginTop: 10 }}>不會寄垃圾信，隨時可取消訂閱</div>
    </Sheet>
  );
}

/* ═══════════════════════════════════════════════════════
   ROOT
   ═══════════════════════════════════════════════════════ */

export default function App() {
  const [phase, setPhase] = useState("landing");
  const [quizMode, setQuizMode] = useState("family");
  const [quizScore, setQuizScore] = useState(0);
  const [familyName, setFamilyName] = useState("");
  const [members, setMembers] = useState([]);
  const [emailOpen, setEmailOpen] = useState(false);

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
        onSubscribe={() => setEmailOpen(true)}
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

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px) } to { opacity:1; transform:translateY(0) } }
        @keyframes float { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-8px) } }
        @keyframes glow { 0%,100% { opacity:.4; transform:scale(1) } 50% { opacity:.7; transform:scale(1.05) } }
        @keyframes slideIn { from { opacity:0; transform:translateX(30px) } to { opacity:1; transform:translateX(0) } }
        @keyframes pop { 0% { transform:scale(.5);opacity:0 } 60% { transform:scale(1.1) } 100% { transform:scale(1);opacity:1 } }
        @keyframes sheetUp { from { transform:translateY(100%) } to { transform:translateY(0) } }
      `}</style>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "14px 18px", borderRadius: 14,
  border: "1.5px solid #EDE8E2", fontSize: 15, outline: "none",
  boxSizing: "border-box", marginBottom: 16,
  fontFamily: "'Noto Sans TC', sans-serif", background: "white", color: "#3A3330",
};
