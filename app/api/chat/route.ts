import {
  createTextStreamResponse,
  streamText,
  toTextStream,
  type ModelMessage,
} from "ai";
import { AiProviderConfigError, getLanguageModel } from "@/lib/ai";
import {
  classifyProviderError,
  createChatErrorResponse,
} from "@/lib/chat/server-errors";

type IncomingMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(request: Request) {
  let messages: IncomingMessage[] = [];

  try {
    const body = (await request.json()) as {
      messages?: IncomingMessage[];
    };

    messages = body.messages ?? [];
  } catch {
    return createChatErrorResponse("invalid_request", 400);
  }

  let model;

  try {
    model = getLanguageModel();
  } catch (error) {
    if (error instanceof AiProviderConfigError) {
      return createChatErrorResponse("provider_config_error", 400);
    }

    throw error;
  }

  try {
    const result = streamText({
      model,
      messages: messages.map(
        (message): ModelMessage => ({
          role: message.role,
          content: message.content,
        }),
      ),
      onError: ({ error }) => {
        console.error("Chat stream failed", error);
      },
    });

    return createTextStreamResponse({
      stream: toTextStream({ stream: result.stream }),
    });
  } catch (error) {
    const [code, status] = classifyProviderError(error);

    console.error("Chat request failed", error);

    return createChatErrorResponse(code, status);
  }
}
