// Vercel Serverless Function — /api/subscribe
// Proxies email subscription to EmailOctopus API
// API key stays on server, never exposed to frontend

export default async function handler(req, res) {
  // Only POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Invalid email" });
  }

  const API_KEY = process.env.EMAILOCTOPUS_API_KEY;
  const LIST_ID = process.env.EMAILOCTOPUS_LIST_ID;

  if (!API_KEY || !LIST_ID) {
    console.error("Missing EMAILOCTOPUS_API_KEY or EMAILOCTOPUS_LIST_ID env vars");
    return res.status(500).json({ error: "Server misconfigured" });
  }

  try {
    const response = await fetch(
      `https://emailoctopus.com/api/1.6/lists/${LIST_ID}/contacts`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: API_KEY,
          email_address: email,
          status: "SUBSCRIBED",
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      return res.status(200).json({ ok: true });
    }

    // Already subscribed = still success
    if (data?.error?.code === "MEMBER_EXISTS_WITH_EMAIL_ADDRESS") {
      return res.status(200).json({ ok: true, already: true });
    }

    console.error("EmailOctopus error:", data);
    return res.status(400).json({ error: data?.error?.message || "Subscription failed" });

  } catch (err) {
    console.error("Fetch error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
