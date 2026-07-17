import {
  createChatError,
  type ChatErrorCode,
} from "./errors";

export const createChatErrorResponse = (
  code: ChatErrorCode,
  status: number,
) => Response.json(createChatError(code), { status });

const getErrorStatus = (error: unknown) => {
  if (!error || typeof error !== "object") {
    return undefined;
  }

  const status =
    "status" in error
      ? error.status
      : "statusCode" in error
        ? error.statusCode
        : undefined;

  return typeof status === "number" ? status : undefined;
};

export const classifyProviderError = (
  error: unknown,
): [ChatErrorCode, number] => {
  const status = getErrorStatus(error);

  if (status === 401 || status === 403) {
    return ["provider_auth_error", 502];
  }

  if (status === 429) {
    return ["rate_limited", 429];
  }

  if (status && status >= 500) {
    return ["provider_unavailable", 503];
  }

  return ["assistant_error", 500];
};
