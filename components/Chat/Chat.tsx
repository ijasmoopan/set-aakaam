import { ChatInput } from "./ChatInput";
import { ChatMessages } from "./ChatMessages";
import type { Message } from "@/lib/types";

const messages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hi, I am ready when you are. What would you like to work on?",
  },
  {
    id: "2",
    role: "user",
    content: "Can you help me sketch out a simple product idea?",
  },
  {
    id: "3",
    role: "assistant",
    content:
      "Absolutely. Give me the rough shape of it and I will help turn it into something concrete.",
  },
  {
    id: "4",
    role: "user",
    content: "I want the chat area to scroll while the input stays put.",
  },
  {
    id: "5",
    role: "assistant",
    content:
      "That layout works well with a vertical flex container, a growing scroll region, and a fixed-height footer composer.\n\n```tsx\n<section className=\"flex h-screen flex-col\">\n  <ChatMessages />\n  <ChatInput />\n</section>\n```",
  },
  {
    id: "6",
    role: "assistant",
    content:
      "Add enough messages here and only this middle section scrolls.\nThe header and input remain visible.",
  },
];

export function Chat() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4 text-slate-950">
      <section className="flex h-[min(760px,calc(100vh-2rem))] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <header className="border-b border-slate-200 px-5 py-4">
          <h1 className="text-base font-semibold">AI Chat</h1>
          <p className="mt-1 text-sm text-slate-500">
            A very basic chat layout
          </p>
        </header>

        <ChatMessages messages={messages} />
        <ChatInput />
      </section>
    </main>
  );
}
