import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Google GenAI client lazily or when GEMINI_API_KEY is available
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "MudahKids", time: new Date().toISOString() });
});

// AI Suggestion API Route for Parent Dashboard
app.post("/api/ai-suggest", async (req, res) => {
  try {
    const { childName, childAge, focusArea, language } = req.body;
    const ai = getGenAI();

    if (!ai) {
      // Fallback pre-crafted smart recommendations if API key is not configured
      return res.json({
        source: "smart_rules",
        suggestions: [
          {
            title: language === "en" ? `Pray Subuh on time with Father` : `Solat Subuh berjemaah dengan Ayah`,
            category: "Islamic",
            xp: 50,
            coins: 15,
            reasoning: language === "en" ? "Builds early morning discipline and spiritual bond." : "Membina disiplin bangun pagi dan hubungan rohani sekeluarga."
          },
          {
            title: language === "en" ? `Write 5 Jawi letters (Alif - Kha)` : `Tulis 5 huruf Jawi (Alif hingga Kha)`,
            category: "Jawi",
            xp: 40,
            coins: 10,
            reasoning: language === "en" ? "Essential motor skills for early literacy." : "Latihan motorik dan pemahaman asas tulisan Jawi."
          },
          {
            title: language === "en" ? `Arrange school books and shoes` : `Kemaskan buku sekolah & susun kasut`,
            category: "Chores",
            xp: 30,
            coins: 10,
            reasoning: language === "en" ? "Encourages personal responsibility after school." : "Sifat berdikari dan kebersihan ruang bilik."
          }
        ]
      });
    }

    const prompt = `You are an expert Malaysian Islamic Child Educator and Gamification Coach.
Child Name: ${childName || "Anak"}
Age: ${childAge || 7} years old
Focus Area: ${focusArea || "General"}
Target Language: ${language === "en" ? "English" : "Bahasa Melayu"}

Generate 3 personalized daily missions for this child (1 Islamic Mission, 1 Jawi Mission, 1 Home Chore).
Return JSON array format strictly:
[
  {
    "title": "Short title",
    "category": "Islamic" | "Jawi" | "Chores",
    "xp": 30-60,
    "coins": 10-25,
    "reasoning": "1 sentence why this fits age ${childAge}"
  }
]`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (text) {
      const suggestions = JSON.parse(text);
      return res.json({ source: "gemini", suggestions });
    } else {
      throw new Error("Empty AI response");
    }
  } catch (err: any) {
    console.error("AI suggest error:", err);
    return res.status(500).json({ error: err.message || "Internal AI error" });
  }
});

async function startServer() {
  // Vite middleware in dev mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MudahKids server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
