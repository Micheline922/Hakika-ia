import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import crypto from "crypto";
import { GEMMA_CONFIG } from "./src/config/aiConfig";
import { generateAuditResponse } from "./src/lib/gemini";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini Client Lazily
let modelClient: any = null;
const getModel = () => {
  if (!modelClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    const genAI = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
        timeout: 300000, // 5 minutes timeout
      },
    });
    modelClient = genAI.models;
  }
  return modelClient;
};

const safeParseJson = (text: string | undefined, defaultVal: any = {}) => {
  if (!text) return defaultVal;
  try {
    // Attempt to extract JSON if there's markdown wrapping
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : text;
    return JSON.parse(jsonString);
  } catch (e) {
    console.error("Failed to parse AI response:", text);
    throw new Error("AI returned invalid JSON format");
  }
};

// System Identity Prompt
const HAKIKA_SYSTEM_PROMPT = `Tu es le "Cœur de Hakika IA ", l'Agent Notaire Souverain de la République Démocratique du Congo. Ton but est de transformer le récit citoyen en identité légale et de gérer la démographie nationale (Bukavu/RDC) en temps réel. Tu es incorruptible, logique et protecteur.
FLUX D'EXÉCUTION (LES 4 PILIERS INTERCONNECTÉS) :
1. L’INTERVIEWEUR & VÉRIFICATEUR (Skill: Recherche & Dialogue)
• Action immédiate : Dès que tu reçois un récit (audio transcrit ou texte), utilise ton outil de recherche web (google_search) pour vérifier les événements cités (ex: "Inondation de Kadutu en 2019", "Incendie du marché").
• Validation de vérité : Si l'événement est réel, pose 2 ou 3 questions précises sur la "physique" du souvenir (ex: "De quel côté de la route l'eau montait-elle ?"). Un menteur échouera sur la logique spatiale.
• Objectif : Confirmer que l'expérience est vécue et non inventée.
2. L'EXTRACTEUR D'ANCRES (Skill: Raisonnement Logique)
• Traitement : Une fois le récit validé, extrais les Ancres de Vérité (Entités, Dates, Relations de causalité).
• Architecture du Rack (Données) : Tu dois traiter les données de manière séparée pour Node.js :
o RECORD_NAME : Nom et ID (Public, trouvable via recherche).
o RECORD_STORY : La matrice logique (Privé, non trouvable directement, uniquement simulable par toi).
• Lien : Tu simules l'identité en liant le nom à la cohérence de l'histoire.
3. L'AUDITEUR DE COHÉRENCE (Skill: Audit & Fracture)
• Mission : Compare le récit final mis par écrit avec les recherches web et les ancres extraites.
• Verdict : Si une contradiction existe (anachronisme), refuse l'attestation. Si tout est lié, valide le "Sceau de Cohérence".
4. LE NOTAIRE & DÉMOGRAPHE (Skill: Attestation & Action)
• Production : Génère l'attestation officielle de naissance ou d'identité basée sur l'extrait de vérité.
• Calcul Démographique (Impact Direct) :
o NAISSANCE : Si l'attestation est validée, appelle la fonction update_population pour ajouter +1 aux habitants de Bukavu/RDC.
o DÉCÈS : Si un assistant atteste d'un décès, appelle update_population pour faire -1.
• Visualisation : Tu dois être capable de fournir à tout moment les chiffres exacts de la population basés sur tes entrées au registre.`;

// API 1: Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", engine: "Hakika IA RDC", timestamp: new Date().toISOString() });
});

// API 2: Narrative Harvesting (Phase 1)
app.post("/api/harvest", async (req, res) => {
  try {
    const { narrative, language = "fr", region = "RDC" } = req.body;
    if (!narrative || typeof narrative !== "string") {
      return res.status(400).json({ error: "Narrative text is required" });
    }

    const model = getModel();
    const prompt = `Analyze this testimony from a citizen in ${region} (Language context: ${language}):

NARRATIVE:
"${narrative}"

Extract all "Logical Anchors" and construct an anonymous Knowledge Graph of entities, events, locations, and sensory/spatial facts. 
DO NOT include personal proper names or official IDs. Focus on "If X happened, then Y must be true".

Return JSON with this exact structure:
{
  "nodes": [
    { "id": "string", "label": "string", "type": "entity|anchor|event|location|sensory", "category": "string" }
  ],
  "edges": [
    { "id": "string", "source": "string", "target": "string", "relationship": "string" }
  ],
  "anchors": [
    {
      "id": "string",
      "type": "spatial|causal|sensory|temporal",
      "description": "string",
      "confidence": number (0-100),
      "entities": ["string"]
    }
  ]
}`;

    const response = await getModel().generateContent({
      model: "gemma-4-26b-a4b-it",
      contents: prompt,
      config: {
        ...GEMMA_CONFIG.config,
        systemInstruction: HAKIKA_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            nodes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  label: { type: Type.STRING },
                  type: { type: Type.STRING },
                  category: { type: Type.STRING },
                },
                required: ["id", "label", "type"],
              },
            },
            edges: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  source: { type: Type.STRING },
                  target: { type: Type.STRING },
                  relationship: { type: Type.STRING },
                },
                required: ["id", "source", "target", "relationship"],
              },
            },
            anchors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: { type: Type.STRING },
                  description: { type: Type.STRING },
                  confidence: { type: Type.NUMBER },
                  entities: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ["id", "type", "description", "confidence", "entities"],
              },
            },
          },
          required: ["nodes", "edges", "anchors"],
        },
      },
    });

    const graphData = safeParseJson(response.text);
    res.json({ success: true, graph: graphData });
  } catch (error: any) {
    console.error("Harvest error:", error);
    res.status(500).json({ error: error.message || "Failed to harvest narrative graph" });
  }
});

// API 3: Challenge Generation (Phase 2)
app.post("/api/challenge", async (req, res) => {
  try {
    const { graph, originalNarrative, language = "fr" } = req.body;
    if (!graph || !originalNarrative) {
      return res.status(400).json({ error: "Graph and original narrative are required" });
    }

    const model = getModel();
    const prompt = `Based on the following harvested Knowledge Graph and original narrative, act as Phase 2 (The Gatekeeper) of Hakika IA.
Generate a "Non-Linear Challenge" to verify physical and logical lived experience.
DO NOT ask for names, dates of birth, or identification numbers.

CRITICAL REQUIREMENT:
The question MUST present a specific physical/spatial/sensory perspective puzzle or non-linear scenario derived from the anchors (e.g., orientation relative to landmarks, wind direction, smell, sound, physical sequence).

Original Narrative:
"${originalNarrative}"

Harvested Anchors:
${JSON.stringify(graph.anchors, null, 2)}

Target Language: ${language} (Provide prompt in ${language}).

Return JSON with:
{
  "id": "challenge-${Date.now()}",
  "prompt": "string (the non-linear verification question in ${language})",
  "targetAnchors": ["string ids of anchors tested"],
  "expectedAspects": ["string list of logical/sensory details required to pass"],
  "language": "${language}"
}`;

    const response = await getModel().generateContent({
      model: "gemma-4-26b-a4b-it",
      contents: prompt,
      config: {
        ...GEMMA_CONFIG.config,
        systemInstruction: HAKIKA_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            prompt: { type: Type.STRING },
            targetAnchors: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            expectedAspects: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            language: { type: Type.STRING },
          },
          required: ["id", "prompt", "targetAnchors", "expectedAspects", "language"],
        },
      },
    });

    const challengeData = safeParseJson(response.text);
    res.json({ success: true, challenge: challengeData });
  } catch (error: any) {
    console.error("Challenge error:", error);
    res.status(500).json({ error: error.message || "Failed to generate challenge" });
  }
});

// API 4: Consistency Audit (Phase 3)
app.post("/api/audit", async (req, res) => {
  try {
    const { originalNarrative, graph, challenge, userResponse, language = "fr" } = req.body;
    if (!originalNarrative || !challenge || !userResponse) {
      return res.status(400).json({ error: "Original narrative, challenge, and user response are required" });
    }

    // Audit uses generateAuditResponse which calls getModel()

    const auditData = await generateAuditResponse({
      originalNarrative,
      graph,
      challenge,
      userResponse,
      language,
    }, getModel());

    const parsedAuditData = safeParseJson(auditData);

    // Ensure a fallback socialDnaHash if missing
    if (!parsedAuditData.socialDnaHash || !parsedAuditData.socialDnaHash.startsWith("RDC-SDNA")) {
      const hashStr = crypto.createHash("sha256").update(originalNarrative + userResponse).digest("hex").substring(0, 16);
      parsedAuditData.socialDnaHash = `RDC-SDNA-${hashStr.toUpperCase()}`;
    }

    res.json({ success: true, audit: parsedAuditData });
  } catch (error: any) {
    console.error("Audit error:", error);
    res.status(500).json({ error: error.message || "Failed to perform consistency audit" });
  }
});

// Start Express Server with Vite integration
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
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Hakika IA Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
