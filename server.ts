import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Set up server-side Gemini client with recommended httpOptions for AI Studio
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Configure middleware to parse JSON bodies with a larger limit for receiving base64 image data
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Helper to check if API key is active
function hasApiKey() {
  return typeof process.env.GEMINI_API_KEY === "string" && process.env.GEMINI_API_KEY.length > 0;
}

// 1. Plant Diagnosis Endpoint
app.post("/api/diagnose", async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { image, mimeType, plantHint, language } = req.body;

    if (!image || !mimeType) {
      res.status(400).json({ error: "Missing image or mimeType" });
      return;
    }

    const isTelugu = language === "te";

    if (!hasApiKey()) {
      // Return a professional mock analysis if the API key is not configured yet
      if (isTelugu) {
        res.json({
          healthy: false,
          confidence: 0.92,
          plantName: plantHint || "టమోటా మొక్క (Solanum lycopersicum)",
          diseaseName: "ఆకు మచ్చల తెగులు (Early Blight)",
          symptoms: [
            "పాత ఆకులపై గుండ్రటి ముదురు గోధుమ రంగు మచ్చలు ఏర్పడతాయి",
            "ఆకులు పసుపు రంగులోకి మారి రాలిపోతాయి",
            "కాండం మీద మరియు రంధ్రాల వద్ద గోధుమ వర్ణ పుండ్లు ఏర్పడతాయి"
          ],
          cause: "వెచ్చని వాతావరణం, అధిక తేమ మరియు ఆకులపై నిలిచే నీటి తడి వల్ల ఆల్టర్నేరియా శిలీంధ్రం వ్యాప్తి చెందుతుంది.",
          severity: "Medium",
          treatment: {
            organic: [
              "వ్యాధి సోకిన క్రింది ఆకులను తుడిచివేసి ఎండబెట్టండి.",
              "వేప నూనె లేదా సేంద్రీయ కాపర్ సోప్ మిశ్రమాన్ని క్రమం తప్పకుండా పిచికారీ చేయండి.",
              "మట్టిలోని వ్యాధి కణాలు పైన చిమ్మకుండా మొదలు వద్ద ఎండిన గడ్డితో కప్పండి (Mulching)."
            ],
            chemical: [
              "తీవ్రతను తగ్గించడానికి నిపుణుల సలహాతో క్లోరోథలోనిల్ లేదా మాంకోజెబ్ కలిపిన మందులను పిచికారీ చేయండి."
            ],
            preventive: [
              "ఒకే నేలలో పదే పదే టమోటాలు గ్రేడ్ రకాలను వేయకండి, పంట మార్పిడి (Crop Rotation) చేయండి.",
              "ఆకులపై నీరు పడకుండా సాయంత్రం వేళల్లో కాకుండా ఉదయాన్నే వేరు వ్యవస్థకు నేరుగా నీరు అందించండి.",
              "గాలి బాగా తగిలేలా మొక్కల మధ్య సరైన దూరం ఉంచండి."
            ]
          },
          cropAdvice: "ఈ ఆకు మచ్చల వ్యాధిని సేంద్రీయ పద్ధతుల ద్వారా సులభంగా నయం చేయవచ్చు. దెబ్బతిన్న ఆకులను కోసి, వేప నూనె జల్లితే మీ పంట మళ్ళీ మంచి దిగుబడిని ఇస్తుంది."
        });
      } else {
        res.json({
          healthy: false,
          confidence: 0.92,
          plantName: plantHint || "Tomato Plant",
          diseaseName: "Early Blight (Alternaria solani)",
          symptoms: [
            "Dark brown, dead spots with concentric rings (target spots) appearing on older leaves first",
            "Leaves turning yellow and dropping prematurely",
            "Dark spots on stems and lesion-like rings near the soil line"
          ],
          cause: "Fungus (Alternaria solani) promoted by warm temperature, high humidity, and frequent rainfall/overhead watering.",
          severity: "Medium",
          treatment: {
            organic: [
              "Prune off lower leaves showing infection to reduce splash dispersals.",
              "Apply copper fungicides or bio-fungicides containing Bacillus subtilis regularly.",
              "Mulch around the base of the plant to prevent soil spores from splashing onto leaves."
            ],
            chemical: [
              "Apply fungicides containing active ingredients like Chlorothalonil or Mancozeb at 7-10 day intervals in damp weather."
            ],
            preventive: [
              "Follow a 3-year crop rotation schedule—avoid planting nightshades (peppers, potatoes, eggplants) in the same soil.",
              "Water only at the root zone via drip irrigation instead of overhead watering.",
              "Space plants adequately to facilitate dry air circulation and sunlight penetration."
            ]
          },
          cropAdvice: "Early Blight is fully manageable. Act promptly to clear the affected foliage, mulch well, and treat with organic copper soap to keep your plant yielding heavily."
        });
      }
      return;
    }

    // Convert the base64 string to a part object
    const imagePart = {
      inlineData: {
        data: image,
        mimeType: mimeType
      }
    };

    let promptText = `Directives: Analyze the attached plant image. Provide a highly accurate agricultural diagnosis of the plant health, disease class, symptoms, cause, severity, treatment (organic, chemical, and preventive), and expert crop advice. If the plant species is not immediately obvious, use the hint: "${plantHint || 'unknown'}". Your response must strictly contain truthful agricultural science and follow the response schema.`;
    
    if (isTelugu) {
      promptText += ` CRITICAL DIRECTIVE FOR LOCALIZATION: Since the requested language is Telugu ("te"), you MUST write all return JSON string properties (excluding the healthy boolean, confidence score, and severity scale of Low/Medium/High) completely in simple, spoken, easily understandable Telugu. Translate 'plantName', 'diseaseName', 'symptoms' arrays, 'cause', 'treatment.organic' arrays, 'treatment.chemical' arrays, 'treatment.preventive' arrays, and 'cropAdvice' into pure Telugu script so local farmers can operate easily.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: {
        parts: [
          imagePart,
          { text: promptText }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            healthy: { type: Type.BOOLEAN, description: "Is the plant completely healthy with no diseases, nutrient deficiencies, or pests?" },
            confidence: { type: Type.NUMBER, description: "A confidence factor between 0.0 and 1.0 indicating diagnosis certainty" },
            plantName: { type: Type.STRING, description: "The common name and scientific name of the identified plant" },
            diseaseName: { type: Type.STRING, description: "The identified disease, pest infectionName, physiological disorder, or 'None (Healthy)'" },
            symptoms: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Strictly clinical symptoms seen on the foliage, stems, or fruits in the photograph"
            },
            cause: { type: Type.STRING, description: "Biological or environmental source" },
            severity: { type: Type.STRING, description: "Severity scale: Low, Medium, High, or None" },
            treatment: {
              type: Type.OBJECT,
              properties: {
                organic: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Eco-friendly, organic controls, biological remedies or cultural prunings" },
                chemical: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Standard chemical pesticides or fungicides if appropriate" },
                preventive: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Methods to ensure the disease does not return or manifest again next season" }
              },
              required: ["organic", "chemical", "preventive"]
            },
            cropAdvice: { type: Type.STRING, description: "Professional agronomist summary of general crop management and future outlook for this plant" }
          },
          required: ["healthy", "confidence", "plantName", "diseaseName", "symptoms", "cause", "severity", "treatment", "cropAdvice"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (err: any) {
    console.error("Diagnosis error:", err);
    res.status(500).json({ error: "Failed to perform diagnosis: " + (err.message || err) });
  }
});

// 2. Agricultural Advice Chat Endpoint
app.post("/api/chat", async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { message, history, language } = req.body;

    if (!message) {
      res.status(400).json({ error: "Missing message query" });
      return;
    }

    const isTelugu = language === "te";

    if (!hasApiKey()) {
      if (isTelugu) {
        res.json({
          reply: `నమస్కారం! నేను మీ పంట తెగుళ్ల గుర్తింపు సహాయకుడిని. (డెమో మోడ్ ఆఫ్‌లైన్‌లో ఉంది).

మట్టి ఆరోగ్యంగా ఉండటానికి తగినంత సేంద్రీయ కంపోస్ట్ ఎరువులు చల్లండి. తెగుళ్లు సోకకుండా కాపాడటానికి ఉదయాన్నే వేర్లకు తగు మోతాదులో నీరు పోయండి, పంట మార్పిడి విధానాన్ని క్రమం తప్పకుండా పాటిస్తే అధిక దిగుబడి లభిస్తుంది!`
        });
      } else {
        res.json({
          reply: `Hello! I am your PlantCare AI agronomy consultant. (Demo status: Offline mode ready).

I noticed process.env.GEMINI_API_KEY is not configured yet. Here's a helpful gardening tip for your crops: Ensure your soil gets regular organic compost replenishment, water in the early morning at the roots to avoid leaf moisture diseases, and rotate your nightshade crops to optimize yield!`
        });
      }
      return;
    }

    // Format history for chat
    const formattedContents: any[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((turn: any) => {
        formattedContents.push({
          role: turn.role === "user" ? "user" : "model",
          parts: [{ text: turn.text }]
        });
      });
    }

    // Add current user prompt
    formattedContents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const systemInstruction = isTelugu 
      ? "You are an expert agriculturalist and botanist named PlantCare AI Advisor. Provide high-quality, practical, scientifically accurate, and encouraging agricultural recommendations completely in simple, spoken Telugu so local farmers can easily read it. Answer queries on plant breeding, soil organic content, companion planting, and harvesting. Keep physical instructions easy to do. Format your answers clearly using markdown bullets and headings."
      : "You are an expert agriculturalist and botanist named PlantCare AI Advisor. Provide high-quality, practical, scientifically accurate, and encouraging agricultural recommendations. Answer queries on plant breeding, soil organic content, fertilizers, irrigation, pest management, crop health, companion planting, and harvesting. Format your answers clearly using markdown bullets and headings.";

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction
      }
    });

    res.json({ reply: response.text });
  } catch (err: any) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "FAQ advice failed: " + (err.message || err) });
  }
});

// Start server and mount Vite development middleware or serve production static assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[PlantCare AI App] full-stack server active on port ${PORT}`);
  });
}

startServer();
