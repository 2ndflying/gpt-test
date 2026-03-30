export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: [
          {
            role: "system",
            content: "너는 마케팅 컨설턴트다. 핵심만 짧게 답해라."
          },
          {
            role: "user",
            content: message
          }
        ],
        max_output_tokens: 150
      })
    });

    const data = await response.json();

    return res.status(200).json({
      reply: data.output?.[0]?.content?.[0]?.text || "응답 없음"
    });

  } catch (error) {
    return res.status(500).json({
      error: "server error",
      detail: String(error)
    });
  }
}
