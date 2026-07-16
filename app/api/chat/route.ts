import { openai } from "@ai-sdk/openai";
import {
  createTextStreamResponse,
  streamText,
  toTextStream,
  type ModelMessage,
} from "ai";

type IncomingMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(request: Request) {
  const { messages } = (await request.json()) as {
    messages?: IncomingMessage[];
  };

  const modelMessages: ModelMessage[] = (messages ?? []).map((message) => ({
    role: message.role,
    content: message.content,
  }));

  const result = streamText({
    model: openai(process.env.OPENAI_MODEL ?? "gpt-5"),
    messages: modelMessages,
  });

  return createTextStreamResponse({
    stream: toTextStream({ stream: result.stream }),
  });
}
