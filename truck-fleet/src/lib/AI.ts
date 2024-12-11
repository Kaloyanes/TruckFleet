import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

export const myOpenAi = createOpenAI({
  // custom settings, e.g.
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export const myGemini = createGoogleGenerativeAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});
