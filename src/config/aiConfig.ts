import { ThinkingLevel } from "@google/genai";

export const GEMMA_CONFIG = {
  model: "gemma-4-26b-a4b-it",
  config: {
    thinkingConfig: {
      thinkingLevel: ThinkingLevel.MINIMAL,
    },
  },
};
