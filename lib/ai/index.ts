import { anthropicProvider } from "./providers/anthropic";
import { geminiProvider } from "./providers/gemini";
import { groqProvider } from "./providers/groq";
import { openaiProvider } from "./providers/openai";
import {
  AiProviderConfigError,
  type AiProvider,
  type AiProviderId,
} from "./providers/types";

const defaultProviderId: AiProviderId = "gemini";

const providers: Record<AiProviderId, AiProvider> = {
  anthropic: anthropicProvider,
  gemini: geminiProvider,
  groq: groqProvider,
  openai: openaiProvider,
};

const isAiProviderId = (value: string): value is AiProviderId =>
  value in providers;

export const getSelectedAiProvider = () => {
  const providerId = process.env.AI_PROVIDER ?? defaultProviderId;

  if (!isAiProviderId(providerId)) {
    throw new AiProviderConfigError(
      `Unsupported AI_PROVIDER "${providerId}". Use one of: ${Object.keys(
        providers,
      ).join(", ")}.`,
    );
  }

  return providers[providerId];
};

export const getLanguageModel = () => getSelectedAiProvider().createModel();

export { AiProviderConfigError };
export type { AiProviderId };
