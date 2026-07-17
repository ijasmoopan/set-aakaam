import { createGoogle } from "@ai-sdk/google";
import { AiProviderConfigError, type AiProvider } from "./types";

const apiKeyEnv = "GEMINI_API_KEY";
const modelEnv = "GEMINI_MODEL";
const defaultModel = "gemini-3.1-flash-lite";

export const geminiProvider: AiProvider = {
  id: "gemini",
  createModel: () => {
    const apiKey = process.env[apiKeyEnv];

    if (!apiKey) {
      throw new AiProviderConfigError(`Set ${apiKeyEnv} to use Gemini.`);
    }

    return createGoogle({ apiKey })(process.env[modelEnv] ?? defaultModel);
  },
};
