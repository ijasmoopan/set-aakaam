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
        className="h-full space-y-4 overflow-y-auto px-5 py-5"
        onScroll={updatePinnedState}
        ref={scrollContainerRef}
      >
        {messages.map((message, index) => {
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
        })}
      </div>

      {showJumpToLatest ? (
        <button
          className="absolute bottom-4 right-5 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          onClick={handleJumpToLatest}
          type="button"
        >
          Jump to latest
        </button>
      ) : null}
    </div>
  );
}
