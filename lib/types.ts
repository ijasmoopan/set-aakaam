import type { ChatUsageMetadata } from "./chat/usage-metadata";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
  status?: "error";
  usage?: ChatUsageMetadata;
};
