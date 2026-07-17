"use client";

import { useRef, useState } from "react";
import { ChatInput } from "./ChatInput";
import { ChatMessages } from "./ChatMessages";
import type { Message } from "@/lib/types";

const initialMessages: Message[] = [
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
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isSending, setIsSending] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSend = async (content: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };
    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
    };

    const nextMessages = [...messages, userMessage];
    const abortController = new AbortController();

    abortControllerRef.current = abortController;
    setMessages([...nextMessages, assistantMessage]);
    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: nextMessages }),
        signal: abortController.signal,
      });

      if (!response.ok || !response.body) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;

        throw new Error(data?.error ?? "The assistant could not respond.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        const chunk = decoder.decode(value, { stream: true });

        setMessages((currentMessages) =>
          currentMessages.map((message) =>
            message.id === assistantMessage.id
              ? { ...message, content: message.content + chunk }
              : message,
          ),
        );
      }

      const remainingText = decoder.decode();

      if (remainingText) {
        setMessages((currentMessages) =>
          currentMessages.map((message) =>
            message.id === assistantMessage.id
              ? { ...message, content: message.content + remainingText }
              : message,
          ),
        );
      }
    } catch (error) {
      const isAbortError =
        error instanceof Error && error.name === "AbortError";

      if (isAbortError) {
        setMessages((currentMessages) =>
          currentMessages.map((message) =>
            message.id === assistantMessage.id && !message.content
              ? {
                  ...message,
                  content: "Response stopped.",
                }
              : message,
          ),
        );
        return;
      }

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Sorry, I could not get a response. Please try again.";

      setMessages((currentMessages) =>
        currentMessages.map((message) =>
          message.id === assistantMessage.id
            ? {
                ...message,
                content: errorMessage,
              }
            : message,
        ),
      );
    } finally {
      if (abortControllerRef.current === abortController) {
        abortControllerRef.current = null;
      }

      setIsSending(false);
    }
  };

  const handleStop = () => {
    abortControllerRef.current?.abort();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4 text-slate-950">
      <section className="flex h-[min(760px,calc(100vh-2rem))] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <header className="border-b border-slate-200 px-5 py-4">
          <h1 className="text-base font-semibold">AI Chat</h1>
          <p className="mt-1 text-sm text-slate-500">
            Start a conversation.
          </p>
        </header>

        <ChatMessages isResponding={isSending} messages={messages} />
        <ChatInput
          isSending={isSending}
          onSend={handleSend}
          onStop={handleStop}
        />
      </section>
    </main>
  );
}
