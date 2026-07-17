import { createOpenAI } from "@ai-sdk/openai";
import { AiProviderConfigError, type AiProvider } from "./types";

const apiKeyEnv = "OPENAI_API_KEY";
const modelEnv = "OPENAI_MODEL";
const defaultModel = "gpt-5";

export const openaiProvider: AiProvider = {
  id: "openai",
  createModel: () => {
    const apiKey = process.env[apiKeyEnv];

    if (!apiKey) {
      throw new AiProviderConfigError(`Set ${apiKeyEnv} to use OpenAI.`);
    }

    return createOpenAI({ apiKey })(process.env[modelEnv] ?? defaultModel);
  },
};
