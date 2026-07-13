export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    return response.status(500).json({ error: "DISCORD_WEBHOOK_URL is not set" });
  }

  const { timeWindow, course, note } = request.body || {};

  if (!timeWindow || !course) {
    return response.status(400).json({ error: "Missing booking details" });
  }

  const content = [
    "🐾 **揉み処たまき　当日予約が入りました**",
    "",
    "お客様：みーちゃん",
    `希望時間：${timeWindow}`,
    `コース：${course}`,
    `ひとこと：${note || "なし"}`,
    "",
    "店主かぷー、出動準備をお願いします。",
  ].join("\n");

  try {
    const discordResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "揉み処たまき",
        content,
      }),
    });

    if (!discordResponse.ok) {
      const detail = await discordResponse.text();
      console.error("Discord webhook error:", discordResponse.status, detail);
      return response.status(502).json({ error: "Failed to notify Discord" });
    }

    return response.status(200).json({ ok: true });
  } catch (error) {
    console.error("Webhook request failed:", error);
    return response.status(502).json({ error: "Webhook request failed" });
  }
}
