import type { AiProviderId } from "@/lib/ai";

export const chatUsageMetadataPrefix = "\n\u001eCHAT_USAGE_METADATA:";

export type ChatUsageMetadata = {
  id: string;
  inputTokens: number | null;
  outputTokens: number | null;
  totalTokens: number | null;
  provider: AiProviderId;
  model: string;
  latency: number;
  createdAt: number;
};
