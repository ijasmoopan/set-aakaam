import { ChatMessage } from "./ChatMessage";
import type { Message } from "@/lib/types";

type ChatMessagesProps = {
  messages: Message[];
};

export function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
    </div>
  );
}
