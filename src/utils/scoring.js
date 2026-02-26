import { PERSONALITY_TYPES } from "../data/quizData";

export function getResult(score, mode) {
  const pct = Math.round((score / 30) * 100);

  const labels = {
    family: { high: "家庭隱形管家", mid: "家庭主要操心者", low: "分工意識不錯", good: "模範家庭分工", unit: "家庭", other: "家人" },
    couple: { high: "關係裡的隱形推手", mid: "關係中的主要操心者", low: "分工還算平衡", good: "模範情侶分工", unit: "這段關係", other: "另一半" },
    roommate: { high: "合租界的隱形管家", mid: "宿舍的主要操心者", low: "室友分工還行", good: "模範室友分工", unit: "這個家", other: "室友" },
  };
  const L = labels[mode] || labels.family;

  let level, color, title, desc, advice, typeKey;

  if (pct >= 80) {
    typeKey = "high";
    level = "嚴重超載";
    color = "#D4456A";
    title = `你是${L.unit}的「${L.high}」`;
    desc = `你承擔了絕大部分的心理負擔和隱形勞務。這不只是「比較操心」，而是長期處於沒人看見的高壓狀態。你值得被看見，也值得被分擔。`;
    advice = `建議先從「列出所有你在做的隱形工作」開始，讓${L.other}真正理解這份清單有多長。`;
  } else if (pct >= 60) {
    typeKey = "mid";
    level = "明顯失衡";
    color = "#E88B3E";
    title = "你扛的比你以為的還多";
    desc = `你承擔了大部分的規劃、記憶和協調工作。${L.other}有參與，但「想到要做什麼」主要還是落在你身上。`;
    advice = `試著把「腦力勞動」——規劃、追蹤、提醒——也列入分工討論，不只是看得見的體力活。`;
  } else if (pct >= 35) {
    typeKey = "low";
    level = "略有不均";
    color = "#D4A843";
    title = "還不錯，但有進步空間";
    desc = `你們的分工有一定基礎，但某些隱形勞務可能還是比較集中在你身上。好消息是，你們已經有溝通的基礎。`;
    advice = "定期做一次「分工盤點」，確認大家對負擔的感受一致。";
  } else {
    typeKey = "good";
    level = "相當均衡";
    color = "#5BA86C";
    title = `你們的分工很健康！`;
    desc = `你們建立了相對均衡的勞務分工，代表你們有良好的溝通和相互尊重。`;
    advice = "持續保持開放的對話，隨著生活變化適時調整。";
  }

  const personality = PERSONALITY_TYPES[mode]?.[typeKey] || PERSONALITY_TYPES.family[typeKey];

  return { pct, level, color, title, desc, advice, personality, typeKey };
}

export function generateShareText(result, mode, modeLabel) {
  const p = result.personality;
  return `我的隱形勞務人格是「${p.type}」（${p.tag}）\n指數 ${result.pct}%（${result.level}）\n\n你也來測測看`;
}

export function generateCompareId() {
  return Math.random().toString(36).substring(2, 10);
}
