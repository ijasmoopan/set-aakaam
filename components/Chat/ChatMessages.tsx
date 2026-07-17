import { useLayoutEffect, useRef, useState } from "react";
import { ChatMessage } from "./ChatMessage";
import type { Message } from "@/lib/types";

type ChatMessagesProps = {
  isResponding?: boolean;
  messages: Message[];
  onRegenerate?: () => void;
  onRetry?: (messageId: string) => void;
};

const bottomThreshold = 48;

export function ChatMessages({
  isResponding = false,
  messages,
  onRegenerate,
  onRetry,
}: ChatMessagesProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isPinnedToBottomRef = useRef(true);
  const [showJumpToLatest, setShowJumpToLatest] = useState(false);

  const scrollToLatest = (behavior: ScrollBehavior = "auto") => {
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer) {
      return;
    }

    scrollContainer.scrollTo({
      behavior,
      top: scrollContainer.scrollHeight,
    });
  };

  const updatePinnedState = () => {
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer) {
      return;
    }

    const distanceFromBottom =
      scrollContainer.scrollHeight -
      scrollContainer.scrollTop -
      scrollContainer.clientHeight;
    const isPinnedToBottom = distanceFromBottom <= bottomThreshold;

    isPinnedToBottomRef.current = isPinnedToBottom;
    setShowJumpToLatest(!isPinnedToBottom);
  };

  const handleJumpToLatest = () => {
    isPinnedToBottomRef.current = true;
    setShowJumpToLatest(false);
    scrollToLatest("smooth");
  };

  useLayoutEffect(() => {
    if (isPinnedToBottomRef.current) {
      scrollToLatest();
      setShowJumpToLatest(false);
      return;
    }

    setShowJumpToLatest(true);
  }, [messages]);

  return (
    <div className="relative min-h-0 flex-1">
      <div
        aria-label="Conversation messages"
        className="chat-scroll h-full space-y-5 overflow-y-auto px-4 py-5 outline-none sm:px-6 sm:py-6"
        onScroll={updatePinnedState}
        ref={scrollContainerRef}
        role="log"
        tabIndex={0}
      >
        {messages.length ? (
          messages.map((message, index) => {
            const isStreamingAssistant =
              isResponding &&
              index === messages.length - 1 &&
              message.role === "assistant";
            const canRegenerate =
              !isResponding &&
              index === messages.length - 1 &&
              message.role === "assistant";

            return (
              <ChatMessage
                canRegenerate={canRegenerate}
                isStreaming={isStreamingAssistant}
                key={message.id}
                message={message}
                onRegenerate={onRegenerate}
                onRetry={onRetry}
              />
            );
          })
        ) : (
          <div className="mx-auto flex h-full max-w-md flex-col items-center justify-center px-4 text-center">
            <div className="mb-4 grid size-12 place-items-center rounded-2xl bg-slate-950 text-sm font-semibold text-white shadow-lg shadow-slate-300 dark:bg-white dark:text-slate-950 dark:shadow-none">
              AI
            </div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Ask a question, draft an idea, or paste something messy.
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Press Enter to send. Use Shift+Enter for a new line.
            </p>
          </div>
        )}
      </div>

      {showJumpToLatest ? (
        <button
          className="absolute bottom-4 right-4 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-lg shadow-slate-200/70 transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 active:translate-y-0 sm:right-6 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:shadow-black/30 dark:hover:border-white/20 dark:hover:bg-slate-800"
          onClick={handleJumpToLatest}
          type="button"
        >
          Jump to latest
        </button>
      ) : null}
    </div>
  );
}
