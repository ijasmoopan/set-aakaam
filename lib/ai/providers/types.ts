import type { LanguageModel } from "ai";

export type AiProviderId = "anthropic" | "gemini" | "groq" | "openai";

export type AiProvider = {
  id: AiProviderId;
  createModel: () => {
    model: LanguageModel;
    modelId: string;
  };
};

export class AiProviderConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AiProviderConfigError";
  }
}
