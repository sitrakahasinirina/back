import axios from "axios";

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message vide" });

    const response = await axios.post(
      "https://api.openrouter.ai/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Tu es un assistant pédagogique spécialisé en informatique. Explique clairement et simplement." },
          { role: "user", content: message }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({ reply: response.data.choices[0].message.content });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Impossible de contacter l'IA pour le moment." });
  }
};
