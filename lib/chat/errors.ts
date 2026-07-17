export type ChatErrorCode =
  | "assistant_error"
  | "invalid_request"
  | "network_error"
  | "provider_auth_error"
  | "provider_config_error"
  | "provider_unavailable"
  | "rate_limited";

export type ChatErrorResponse = {
  code: ChatErrorCode;
  error: string;
};

export const fallbackChatErrorMessage =
  "Sorry, I could not get a response. Please try again.";

export const chatErrorMessages: Record<ChatErrorCode, string> = {
  assistant_error:
    "The assistant ran into a temporary problem. Please try again.",
  invalid_request: "The message could not be sent. Please try again.",
  network_error:
    "I could not reach the assistant. Check your connection and try again.",
  provider_auth_error:
    "The assistant could not authenticate with the AI provider. Please check the API key and try again.",
  provider_config_error:
    "The assistant is not configured correctly yet. Please check the provider settings and API key.",
  provider_unavailable:
    "The AI provider is having trouble right now. Please try again shortly.",
  rate_limited:
    "The assistant is being rate limited right now. Please wait a moment and try again.",
};

export class ChatResponseError extends Error {
  constructor(
    message = fallbackChatErrorMessage,
    readonly code: ChatErrorCode = "assistant_error",
  ) {
    super(message);
    this.name = "ChatResponseError";
  }
}

export const createChatError = (code: ChatErrorCode): ChatErrorResponse => ({
  code,
  error: chatErrorMessages[code],
});

export const getChatErrorMessage = (error: unknown) => {
  if (error instanceof ChatResponseError) {
    return error.message;
  }

  if (error instanceof Error && error.name === "TypeError") {
    return chatErrorMessages.network_error;
  }

  return chatErrorMessages.assistant_error;
};
