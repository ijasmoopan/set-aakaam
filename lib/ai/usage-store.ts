import type { AiProviderId } from "./providers/types";

export type TokenUsageRecord = {
  id: string;
  inputTokens: number | null;
  outputTokens: number | null;
  totalTokens: number | null;
  provider: AiProviderId;
  model: string;
  latency: number;
  createdAt: number;
};

const tokenUsageRecords: TokenUsageRecord[] = [];

export const storeTokenUsage = (record: TokenUsageRecord) => {
  tokenUsageRecords.push(record);
};

export const getTokenUsageRecords = () => [...tokenUsageRecords];
