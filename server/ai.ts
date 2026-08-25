import express from "express";
import { authenticate } from "./auth";
import { GoogleGenAI } from "@google/genai";
import multer from "multer";

export const aiRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

aiRouter.post("/chat", authenticate, async (req: any, res) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const { message, history } = req.body;

    const systemInstruction = "You are an AI assistant for Memo, an African airtime and data top-up platform. Help users with questions about their transactions, buying airtime/data, or navigating the platform. Keep your answers concise, friendly, and helpful.";

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: [...history, { role: "user", parts: [{ text: message }] }],
      config: {
        systemInstruction,
      }
    });

    res.json({ reply: response.text });
  } catch (error) {
    console.error("AI Chat error:", error);
    res.status(500).json({ error: "Failed to get AI response" });
  }
});

aiRouter.post("/transcribe", authenticate, upload.single("audio"), async (req: any, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No audio file provided" });
    
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: "Transcribe the following audio exactly as spoken:" },
            {
              inlineData: {
                data: req.file.buffer.toString("base64"),
                mimeType: req.file.mimetype,
              }
            }
          ]
        }
      ],
    });

    res.json({ text: response.text });
  } catch (error) {
    console.error("Transcription error:", error);
    res.status(500).json({ error: "Failed to transcribe audio" });
  }
});
