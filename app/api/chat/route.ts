import {
  createTextStreamResponse,
  streamText,
  toTextStream,
  type ModelMessage,
} from "ai";
import { AiProviderConfigError, getLanguageModelConfig } from "@/lib/ai";
import { createTokenUsageTracker } from "@/lib/ai/usage-tracker";
import { getTokenUsageRecords } from "@/lib/ai/usage-store";
import {
  classifyProviderError,
  createChatErrorResponse,
} from "@/lib/chat/server-errors";
import { appendChatUsageMetadata } from "@/lib/chat/usage-metadata-stream";

type IncomingMessage = {
  role: "user" | "assistant";
  content: string;
};

export function GET() {
  return Response.json({
    usage: getTokenUsageRecords(),
  });
}

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

  let modelConfig;

  try {
    modelConfig = getLanguageModelConfig();
  } catch (error) {
    if (error instanceof AiProviderConfigError) {
      return createChatErrorResponse("provider_config_error", 400);
    }

    throw error;
  }

  try {
    const usageTracker = createTokenUsageTracker({
      provider: modelConfig.providerId,
      model: modelConfig.modelId,
    });

    const result = streamText({
      model: modelConfig.model,
      messages: messages.map(
        (message): ModelMessage => ({
          role: message.role,
          content: message.content,
        }),
      ),
      onError: ({ error }) => {
        console.error("Chat stream failed", error);
      },
      onEnd: ({ usage }) => {
        usageTracker.trackUsage(usage);
      },
    });

    return createTextStreamResponse({
      stream: appendChatUsageMetadata({
        stream: toTextStream({ stream: result.stream }),
        usage: usageTracker.record,
      }),
    });
  } catch (error) {
    const [code, status] = classifyProviderError(error);

    console.error("Chat request failed", error);

    return createChatErrorResponse(code, status);
  }
}
