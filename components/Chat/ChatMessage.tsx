import { Markdown } from "./Markdown";
import type { Message } from "@/lib/types";

type ChatMessageProps = {
  isStreaming?: boolean;
  message: Message;
};

export function ChatMessage({
  isStreaming = false,
  message,
}: ChatMessageProps) {
  const isUser = message.role === "user";
  const showTypingIndicator = isStreaming && !message.content;

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-3 text-sm leading-6 ${
          isUser ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-800"
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
