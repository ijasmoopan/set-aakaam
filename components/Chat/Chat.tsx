"use client";

import { useRef, useState } from "react";
import { ChatInput } from "./ChatInput";
import { ChatMessages } from "./ChatMessages";
import {
  ChatResponseError,
  fallbackChatErrorMessage,
  getChatErrorMessage,
  type ChatErrorResponse,
} from "@/lib/chat/errors";
import type { Message } from "@/lib/types";

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessages = async (
    nextMessages: Message[],
    assistantMessage: Message,
  ) => {
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
        body: JSON.stringify({
          messages: nextMessages.filter(
            (message) => message.status !== "error",
          ),
        }),
        signal: abortController.signal,
      });

      if (!response.ok || !response.body) {
        const data = (await response
          .json()
          .catch(() => null)) as ChatErrorResponse | null;

        throw new ChatResponseError(
          data?.error ?? fallbackChatErrorMessage,
          data?.code,
        );
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

      const errorMessage = getChatErrorMessage(error);

      setMessages((currentMessages) =>
        currentMessages.map((message) =>
          message.id === assistantMessage.id
            ? {
                ...message,
                content: errorMessage,
                status: "error",
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

  const handleSend = async (content: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      createdAt: Date.now(),
    };
    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
      createdAt: Date.now(),
    };

    const nextMessages = [...messages, userMessage];

    await sendMessages(nextMessages, assistantMessage);
  };

  const handleRetry = async (assistantMessageId: string) => {
    const failedAssistantIndex = messages.findIndex(
      (message) => message.id === assistantMessageId,
    );

    if (failedAssistantIndex <= 0 || isSending) {
      return;
    }

    const previousUserMessage = messages[failedAssistantIndex - 1];

    if (previousUserMessage.role !== "user") {
      return;
    }

    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
      createdAt: Date.now(),
    };
    const nextMessages = messages.slice(0, failedAssistantIndex);

    await sendMessages(nextMessages, assistantMessage);
  };

  const handleRegenerate = async () => {
    if (isSending) {
      return;
    }

    const lastUserMessageIndex = messages.findLastIndex(
      (message) => message.role === "user",
    );

    if (lastUserMessageIndex < 0) {
      return;
    }

    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
      createdAt: Date.now(),
    };
    const nextMessages = messages.slice(0, lastUserMessageIndex + 1);

    await sendMessages(nextMessages, assistantMessage);
  };

  const handleStop = () => {
    abortControllerRef.current?.abort();
  };

  return (
    <main
      className="chat-shell flex min-h-dvh items-center justify-center p-3 text-slate-950 transition-colors duration-300 sm:p-6 dark:text-slate-100"
      data-theme={theme}
    >
      <a className="skip-link" href="#message">
        Skip to composer
      </a>
      <section
        aria-label="AI chat"
        className="flex h-[calc(100dvh-1.5rem)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-2xl shadow-slate-200/70 backdrop-blur sm:h-[min(820px,calc(100dvh-3rem))] dark:border-white/10 dark:bg-slate-950/90 dark:shadow-slate-950/50"
      >
        <header className="flex items-center justify-between gap-4 border-b border-slate-200/80 px-4 py-3 sm:px-6 sm:py-4 dark:border-white/10">
          <div className="min-w-0">
            <h1 className="text-base font-semibold leading-6 text-slate-950 dark:text-white">
              AI Chat
            </h1>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              {isSending ? "Assistant is writing..." : "Start a conversation."}
            </p>
          </div>
          <button
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 active:translate-y-0 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-white/20 dark:hover:bg-white/10"
            onClick={() =>
              setTheme((current) => (current === "dark" ? "light" : "dark"))
            }
            type="button"
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </header>

        <ChatMessages
          isResponding={isSending}
          messages={messages}
          onRegenerate={handleRegenerate}
          onRetry={handleRetry}
        />
        <ChatInput
          isSending={isSending}
          onSend={handleSend}
          onStop={handleStop}
        />
      </section>
    </main>
  );
}
