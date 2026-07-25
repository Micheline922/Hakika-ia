import { ThinkingLevel, Type } from "@google/genai";
import { GEMMA_CONFIG } from "../config/aiConfig";

const HAKIKA_SYSTEM_PROMPT = `Tu es un expert reconnu en audit de cohérence narrative et en validation de preuves d'identité. Ta mission est d'analyser les récits citoyens, de détecter les incohérences logiques, de vérifier la véracité des faits par rapport aux ancrages fournis, et de garantir que toute attestation ou résumé produit est strictement conforme à la réalité des faits établis.`;

/**
 * Handles API calls to Gemma 4 for audit tasks.
 */
export async function generateAuditResponse(auditData: {
  originalNarrative: string;
  graph: any;
  challenge: any;
  userResponse: string;
  language: string;
}, model: any) {
  const prompt = `Perform Phase 3: CONSISTENCY AUDIT as the Judge of Hakika IA.
Everything must be in French (Tout doit être en français).

Original Narrative:
"${auditData.originalNarrative}"

Challenge Question:
"${auditData.challenge.prompt}"

User Response to Challenge:
"${auditData.userResponse}"

Harvested Anchors:
${JSON.stringify(auditData.graph.anchors, null, 2)}

Expected Logical Aspects:
${JSON.stringify(auditData.challenge.expectedAspects, null, 2)}

Evaluate the user's response against the original narrative signature and physical reality in the Democratic Republic of Congo (RDC).
Check for:
1. "Verified Anchors" (Physical, spatial, causal, temporal, sensory alignment confirmed)
2. "Narrative Fractures" (Anachronisms, spatial impossibilities, seasonal contradictions, causal inconsistencies in RDC regional climate/geography)
3. Confidence Score (0-100%)
4. Status: "VALIDATED" (score >= 75), "INCONCLUSIVE" (50-74), or "REJECTED" (< 50).
5. Detailed Reasoning & Cultural Context Notes (explaining RDC geography/seasons/local nuances - MUST BE IN FRENCH).

Return JSON with:
{
  "confidenceScore": number (0-100),
  "status": "VALIDATED" | "INCONCLUSIVE" | "REJECTED",
  "verifiedAnchors": ["string description of confirmed anchors (spatial, causal, sensory, temporal) - EN FRANÇAIS"],
  "fractures": [
    {
      "type": "string (e.g., Anachronism, Spatial Impossibility, Seasonal Contradiction, Causal Discontinuity) - EN FRANÇAIS",
      "description": "string (EN FRANÇAIS)",
      "severity": "low" | "medium" | "critical",
      "contextNote": "string (EN FRANÇAIS)"
    }
  ],
  "reasoning": "string (detailed audit narrative - EN FRANÇAIS)",
  "culturalContextNotes": "string (explanation of Congolese geographical/historical logic applied - EN FRANÇAIS)",
  "socialDnaHash": "RDC-SDNA-[sha256 snippet]",
  "timestamp": "${new Date().toISOString()}",
  "auditId": "audit-${Date.now()}"
}`;

  const response = await model.generateContent({
    contents: prompt,
    config: {
      ...GEMMA_CONFIG.config,
      systemInstruction: HAKIKA_SYSTEM_PROMPT,
      thinkingConfig: {
        thinkingLevel: ThinkingLevel.MINIMAL,
      },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          confidenceScore: { type: Type.NUMBER },
          status: { type: Type.STRING },
          verifiedAnchors: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          fractures: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING },
                description: { type: Type.STRING },
                severity: { type: Type.STRING },
                contextNote: { type: Type.STRING },
              },
              required: ["type", "description", "severity", "contextNote"],
            },
          },
          reasoning: { type: Type.STRING },
          culturalContextNotes: { type: Type.STRING },
          socialDnaHash: { type: Type.STRING },
          timestamp: { type: Type.STRING },
          auditId: { type: Type.STRING },
        },
        required: [
          "confidenceScore",
          "status",
          "verifiedAnchors",
          "fractures",
          "reasoning",
          "culturalContextNotes",
          "socialDnaHash",
          "timestamp",
          "auditId",
        ],
      },
    },
  });

  return response.text;
}
