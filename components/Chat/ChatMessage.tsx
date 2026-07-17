import { Markdown } from "./Markdown";
import type { Message } from "@/lib/types";

type ChatMessageProps = {
  canRegenerate?: boolean;
  isStreaming?: boolean;
  message: Message;
  onRegenerate?: () => void;
  onRetry?: (messageId: string) => void;
};

const formatMessageTime = (createdAt: number) =>
  new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(createdAt));

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
  const timestamp = formatMessageTime(message.createdAt);
  const avatarLabel = isUser ? "You" : "AI";

  return (
    <article
      aria-label={`${isUser ? "Your" : "Assistant"} message sent at ${timestamp}`}
      className={`message-enter flex items-end gap-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser ? (
        <div
          aria-hidden="true"
          className="grid size-9 shrink-0 place-items-center rounded-2xl bg-slate-950 text-xs font-semibold text-white shadow-sm dark:bg-white dark:text-slate-950"
        >
          {avatarLabel}
        </div>
      ) : null}

      <div
        className={`min-w-0 max-w-[min(82%,42rem)] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm transition-colors sm:max-w-[76%] ${
          isUser
            ? "rounded-br-md bg-slate-950 text-white shadow-slate-300/70 dark:bg-white dark:text-slate-950 dark:shadow-none"
            : isError
              ? "rounded-bl-md border border-red-200 bg-red-50 text-red-900 dark:border-red-400/30 dark:bg-red-950/40 dark:text-red-100"
              : "rounded-bl-md bg-slate-100 text-slate-800 dark:bg-white/10 dark:text-slate-100"
        }`}
      >
        <div
          className={`mb-1 flex items-center gap-2 text-[0.7rem] font-medium leading-4 ${
            isUser
              ? "text-white/70 dark:text-slate-950/60"
              : isError
                ? "text-red-700/70 dark:text-red-100/70"
                : "text-slate-500 dark:text-slate-400"
          }`}
        >
          <span>{isUser ? "You" : "Assistant"}</span>
          <span aria-hidden="true">/</span>
          <time dateTime={new Date(message.createdAt).toISOString()}>
            {timestamp}
          </time>
        </div>

        {showTypingIndicator ? (
          <div
            aria-label="Assistant is responding"
            className="flex items-center gap-2 text-slate-500 dark:text-slate-400"
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
                    className="rounded-md border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 transition duration-200 hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 active:scale-[0.98] dark:border-red-400/30 dark:bg-red-950/40 dark:text-red-100 dark:hover:bg-red-900/50"
                    onClick={() => onRetry?.(message.id)}
                    type="button"
                  >
                    Retry
                  </button>
                ) : null}
                {canRegenerate ? (
                  <button
                    className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition duration-200 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 active:scale-[0.98] dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
                    onClick={onRegenerate}
                    type="button"
                  >
                    Regenerate
                  </button>
                ) : null}
              </div>
            ) : null}
            {isStreaming ? (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <span className="typing-caret" aria-hidden="true" />
                <span>Responding</span>
              </div>
            ) : null}
          </>
        )}
      </div>

      {isUser ? (
        <div
          aria-hidden="true"
          className="grid size-9 shrink-0 place-items-center rounded-2xl bg-slate-200 text-xs font-semibold text-slate-700 shadow-sm dark:bg-white/10 dark:text-slate-200"
        >
          {avatarLabel}
        </div>
      ) : null}
    </article>
  );
}
