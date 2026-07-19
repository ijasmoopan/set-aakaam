import type { LanguageModelUsage } from "ai";
import type { AiProviderId } from "./providers/types";
import { storeTokenUsage, type TokenUsageRecord } from "./usage-store";

type TokenUsageTrackerOptions = {
  provider: AiProviderId;
  model: string;
};

export type TokenUsageTracker = {
  record: Promise<TokenUsageRecord>;
  trackUsage: (usage: LanguageModelUsage) => void;
};

export const createTokenUsageTracker = ({
  provider,
  model,
}: TokenUsageTrackerOptions): TokenUsageTracker => {
  const startedAt = Date.now();
  let resolveRecord: (record: TokenUsageRecord) => void;
  const record = new Promise<TokenUsageRecord>((resolve) => {
    resolveRecord = resolve;
  });

  return {
    record,
    trackUsage: (usage) => {
      const createdAt = Date.now();
      const record = {
        id: crypto.randomUUID(),
        inputTokens: usage.inputTokens ?? null,
        outputTokens: usage.outputTokens ?? null,
        totalTokens: usage.totalTokens ?? null,
        provider,
        model,
        latency: createdAt - startedAt,
        createdAt,
      };

      storeTokenUsage(record);
      resolveRecord(record);
    },
  };
};
