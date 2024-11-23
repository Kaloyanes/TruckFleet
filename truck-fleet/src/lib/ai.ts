import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

export const myOpenAi = createOpenAI({
  // custom settings, e.g.
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  compatibility: "strict", // strict mode, enable when using the OpenAI API
});

export const myGemini = createGoogleGenerativeAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});
