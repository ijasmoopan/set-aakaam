import { Markdown } from "./Markdown";
import type { Message } from "@/lib/types";

type ChatMessageProps = {
  canRegenerate?: boolean;
  isStreaming?: boolean;
  message: Message;
  onRegenerate?: () => void;
  onRetry?: (messageId: string) => void;
};

export function ChatMessage({
  canRegenerate = false,
  isStreaming = false,
  message,
  onRegenerate,
  onRetry,
}: ChatMessageProps) {
  const isUser = message.role === "user";
  const isError = message.status === "error";
  const showTypingIndicator = isStreaming && !message.content;

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-3 text-sm leading-6 ${
          isUser
            ? "bg-slate-950 text-white"
            : isError
              ? "border border-red-200 bg-red-50 text-red-900"
              : "bg-slate-100 text-slate-800"
        }`}
      >
        {showTypingIndicator ? (
          <div
            aria-label="Assistant is responding"
            className="flex items-center gap-2 text-slate-500"
          >
            <span>Assistant is responding</span>
            <span className="flex gap-1" aria-hidden="true">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.2s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.1s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" />
            </span>
          </div>
        ) : (
          <>
            <Markdown content={message.content} />
            {isError || canRegenerate ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {isError ? (
                  <button
                    className="rounded-md border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100"
                    onClick={() => onRetry?.(message.id)}
                    type="button"
                  >
                    Retry
                  </button>
                ) : null}
                {canRegenerate ? (
                  <button
                    className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                    onClick={onRegenerate}
                    type="button"
                  >
                    Regenerate
                  </button>
                ) : null}
              </div>
            ) : null}
            {isStreaming ? (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
                <span>Responding</span>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
