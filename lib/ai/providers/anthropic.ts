import { createAnthropic } from "@ai-sdk/anthropic";
import { AiProviderConfigError, type AiProvider } from "./types";

const apiKeyEnv = "ANTHROPIC_API_KEY";
const modelEnv = "ANTHROPIC_MODEL";
const defaultModel = "claude-sonnet-4-5";

export const anthropicProvider: AiProvider = {
  id: "anthropic",
  createModel: () => {
    const apiKey = process.env[apiKeyEnv];

    if (!apiKey) {
      throw new AiProviderConfigError(`Set ${apiKeyEnv} to use Anthropic.`);
    }

    return createAnthropic({ apiKey })(process.env[modelEnv] ?? defaultModel);
  },
};
