import fs from "fs";
import path from "path";
import * as pdfParse from "pdf-parse";
import * as mammoth from "mammoth";
import axios from "axios";

const results = {}; // stockage temporaire

export async function uploadDocument(req, res) {
  if (!req.file) return res.status(400).json({ error: "Fichier manquant" });

  const ext = path.extname(req.file.originalname).toLowerCase();
  let text = "";

  try {
    // Lecture du fichier
    if (ext === ".pdf") {
      const dataBuffer = fs.readFileSync(req.file.path);
      const pdfData = await pdfParse.default(dataBuffer);
      text = pdfData.text;
    } else if (ext === ".docx") {
      const result = await mammoth.extractRawText({ path: req.file.path });
      text = result.value;
    } else {
      return res.status(400).json({ error: "Format non supporté (PDF/DOCX seulement)" });
    }

    // Appel OpenRouter API
    const response = await axios.post(
      "https://api.openrouter.ai/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          { role: "user", content: `Fais un résumé clair et synthétique de ce texte :\n\n${text}` }
        ],
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const summary = response.data.choices[0].message.content;

    // Stockage temporaire
    const id = Date.now().toString();
    results[id] = { status: "ok", summary, raw: text };

    res.json({ id, summary });

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Erreur serveur ou problème OpenRouter" });
  }
}

export function getResult(req, res) {
  const { id } = req.params;
  if (!results[id]) return res.status(404).json({ error: "Résultat introuvable" });
  res.json({ result: results[id] });
}
