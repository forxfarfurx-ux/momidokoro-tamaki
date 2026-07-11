export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    return response.status(500).json({ error: "DISCORD_WEBHOOK_URL is not set" });
  }

  const { condition, course, strength, part, note } = request.body || {};

  const content = [
    "🐾 **揉み処たまき 予約が入りました**",
    "",
    `お客様：みーちゃん`,
    `本日の足の状態：${condition || "未選択"}`,
    `コース：${course || "未選択"}`,
    `強さ：${strength || "未選択"}`,
    `重点部位：${part || "未選択"}`,
    `備考：${note || "なし"}`,
    "",
    "店主かぷー、出動準備をお願いします。",
  ].join("\n");

  const discordResponse = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });

  if (!discordResponse.ok) {
    return response.status(502).json({ error: "Failed to notify Discord" });
  }

  return response.status(200).json({ ok: true });
}
