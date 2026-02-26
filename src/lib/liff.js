// LINE LIFF SDK integration
// LIFF ID needs to be configured in environment variables

let liffInitialized = false;
let liffError = null;

export async function initLIFF() {
  const liffId = import.meta.env.VITE_LIFF_ID;
  if (!liffId) {
    liffError = "LIFF ID not configured";
    return false;
  }

  try {
    // Dynamically load LIFF SDK
    if (!window.liff) {
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://static.line-scdn.net/liff/edge/2/sdk.js";
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    await window.liff.init({ liffId });
    liffInitialized = true;
    return true;
  } catch (err) {
    liffError = err.message;
    return false;
  }
}

export function isInLIFF() {
  if (!liffInitialized || !window.liff) return false;
  return window.liff.isInClient();
}

export function getLIFFProfile() {
  if (!liffInitialized || !window.liff) return null;
  if (!window.liff.isLoggedIn()) return null;
  return window.liff.getProfile();
}

export async function shareLINE(text) {
  if (!liffInitialized || !window.liff) return false;

  if (!window.liff.isApiAvailable("shareTargetPicker")) {
    return false;
  }

  try {
    await window.liff.shareTargetPicker([
      {
        type: "text",
        text,
      },
    ]);
    return true;
  } catch {
    return false;
  }
}

export async function shareFlexMessage(title, resultData) {
  if (!liffInitialized || !window.liff) return false;
  if (!window.liff.isApiAvailable("shareTargetPicker")) return false;

  const siteUrl = window.location.origin;

  try {
    await window.liff.shareTargetPicker([
      {
        type: "flex",
        altText: `${title} - 隱形勞務指數 ${resultData.pct}%`,
        contents: {
          type: "bubble",
          size: "mega",
          header: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: "🏠 隱形勞務測驗結果",
                weight: "bold",
                size: "sm",
                color: "#D4456A",
              },
            ],
            paddingAll: "16px",
            backgroundColor: "#FBF7F3",
          },
          body: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: `${resultData.personality.emoji} ${resultData.personality.type}`,
                weight: "bold",
                size: "xl",
                color: "#3A3330",
                align: "center",
              },
              {
                type: "text",
                text: `指數 ${resultData.pct}%（${resultData.level}）`,
                size: "md",
                color: resultData.color,
                align: "center",
                margin: "md",
              },
              {
                type: "text",
                text: resultData.personality.desc,
                size: "sm",
                color: "#8C8278",
                align: "center",
                margin: "md",
                wrap: true,
              },
              {
                type: "separator",
                margin: "lg",
              },
              {
                type: "text",
                text: "你也來測測看 👉",
                size: "sm",
                color: "#B0A498",
                align: "center",
                margin: "lg",
              },
            ],
            paddingAll: "20px",
          },
          footer: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "button",
                action: {
                  type: "uri",
                  label: "開始測驗",
                  uri: siteUrl,
                },
                style: "primary",
                color: "#D4456A",
              },
            ],
            paddingAll: "12px",
          },
        },
      },
    ]);
    return true;
  } catch {
    return false;
  }
}

export { liffInitialized, liffError };
