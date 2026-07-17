import { createGroq } from "@ai-sdk/groq";
import { AiProviderConfigError, type AiProvider } from "./types";

const apiKeyEnv = "GROQ_API_KEY";
const modelEnv = "GROQ_MODEL";
const defaultModel = "llama-3.3-70b-versatile";

export const groqProvider: AiProvider = {
  id: "groq",
  createModel: () => {
    const apiKey = process.env[apiKeyEnv];

    if (!apiKey) {
      throw new AiProviderConfigError(`Set ${apiKeyEnv} to use Groq.`);
    }

    return createGroq({ apiKey })(process.env[modelEnv] ?? defaultModel);
  },
};
