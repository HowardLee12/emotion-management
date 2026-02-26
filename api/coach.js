// Vercel Serverless Function — /api/coach
// AI coaching endpoint that generates personalized advice based on quiz results

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { score, mode, pct, level, typeKey } = req.body;

  if (typeof score !== "number" || !mode) {
    return res.status(400).json({ error: "Missing score or mode" });
  }

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

  // If no API key, return pre-built advice
  if (!ANTHROPIC_API_KEY) {
    return res.status(200).json({
      ok: true,
      advice: getStaticAdvice(pct, mode, typeKey),
      source: "static",
    });
  }

  const modeLabels = {
    family: "家人同住",
    couple: "情侶同居",
    roommate: "室友合租",
  };

  const prompt = `你是一位家庭關係諮詢專家。使用者剛做完「隱形勞務測驗」，結果如下：

- 生活模式：${modeLabels[mode] || "家人同住"}
- 隱形勞務指數：${pct}%
- 程度：${level}

請生成一份個人化的「本週改善計畫」，包含：
1. 一句話總結（溫暖、不帶指責）
2. 三個具體的小行動（每個不超過 20 字，要非常具體可執行）
3. 一句給伴侶/家人/室友看的話（幫助對方理解）

格式用 JSON：
{
  "summary": "一句話總結",
  "actions": ["行動1", "行動2", "行動3"],
  "messageForOther": "給對方看的話"
}

只回覆 JSON，不要其他文字。用繁體中文。`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 512,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error("Anthropic API error:", errData);
      return res.status(200).json({
        ok: true,
        advice: getStaticAdvice(pct, mode, typeKey),
        source: "static_fallback",
      });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || "";

    try {
      const advice = JSON.parse(text);
      return res.status(200).json({ ok: true, advice, source: "ai" });
    } catch {
      return res.status(200).json({
        ok: true,
        advice: getStaticAdvice(pct, mode, typeKey),
        source: "static_parse_error",
      });
    }
  } catch (err) {
    console.error("Coach API error:", err);
    return res.status(200).json({
      ok: true,
      advice: getStaticAdvice(pct, mode, typeKey),
      source: "static_error",
    });
  }
}

function getStaticAdvice(pct, mode, typeKey) {
  const adviceMap = {
    high: {
      summary: "你承擔了太多看不見的重擔，這份疲憊是真實的，你值得被理解。",
      actions: [
        "今天列出 5 件你「自動在做」的事",
        "選 1 件事明確請對方接手",
        "找 10 分鐘跟對方分享你的感受",
      ],
      messageForOther: "我不是在抱怨，我只是希望你知道我一直在默默做的那些事。我們可以一起想想怎麼分擔嗎？",
    },
    mid: {
      summary: "你做的比表面看起來的多很多，是時候讓這些「隱形工作」被看見了。",
      actions: [
        "跟對方一起列「家事清單」",
        "把「想到要做什麼」這件事也算進去",
        "這週試著讓對方「完整負責」一件事",
      ],
      messageForOther: "我發現有些事我一直在做但你可能沒注意到。不是你的錯，我們一起看看這份清單好嗎？",
    },
    low: {
      summary: "你們有不錯的基礎，只要稍微調整就能更好！",
      actions: [
        "週末花 10 分鐘做「分工盤點」",
        "感謝對方這週做的一件事",
        "把隱形勞務加入你們的對話",
      ],
      messageForOther: "我們的分工已經不錯了，一起看看還有哪裡可以更好吧！",
    },
    good: {
      summary: "你們做得很棒！保持這樣的溝通和默契。",
      actions: [
        "跟對方說聲謝謝",
        "分享你們的經驗給身邊的朋友",
        "每月固定做一次分工 check-in",
      ],
      messageForOther: "我覺得我們的分工很棒，謝謝你總是願意一起承擔。",
    },
  };

  return adviceMap[typeKey] || adviceMap.mid;
}
