import {
  createTextStreamResponse,
  streamText,
  toTextStream,
  type ModelMessage,
} from "ai";
import { AiProviderConfigError, getLanguageModel } from "@/lib/ai";

type IncomingMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(request: Request) {
  const { messages } = (await request.json()) as {
    messages?: IncomingMessage[];
  };

  let model;

  try {
    model = getLanguageModel();
  } catch (error) {
    if (error instanceof AiProviderConfigError) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    throw error;
  }

  const result = streamText({
    model,
    messages: (messages ?? []).map(
      (message): ModelMessage => ({
        role: message.role,
        content: message.content,
      }),
    ),
  });

  return createTextStreamResponse({
    stream: toTextStream({ stream: result.stream }),
  });
}
