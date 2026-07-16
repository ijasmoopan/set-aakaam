import { Markdown } from "./Markdown";
import type { Message } from "@/lib/types";

type ChatMessageProps = {
  message: Message;
};

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-3 text-sm leading-6 ${
          isUser ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-800"
        }`}
      >
        <Markdown content={message.content} />
      </div>
    </div>
  );
}
