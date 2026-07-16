"use client";

import {
  type KeyboardEvent,
  type ComponentProps,
  useEffect,
  useRef,
  useState,
} from "react";

type ChatInputProps = {
  isSending?: boolean;
  onSend: (message: string) => void | Promise<void>;
};

export function ChatInput({ isSending = false, onSend }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const canSend = message.trim().length > 0 && !isSending;

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [message]);

  const sendMessage = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || isSending) {
      return;
    }

    setMessage("");
    await onSend(trimmedMessage);
  };

  const handleSubmit: ComponentProps<"form">["onSubmit"] = async (event) => {
    event.preventDefault();
    await sendMessage();
  };

  const handleKeyDown = async (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      event.key !== "Enter" ||
      event.shiftKey ||
      event.nativeEvent.isComposing
    ) {
      return;
    }

    event.preventDefault();
    await sendMessage();
  };

  return (
    <form
      className="flex items-end gap-3 border-t border-slate-200 bg-white p-4"
      onSubmit={handleSubmit}
    >
      <label className="sr-only" htmlFor="message">
        Message
      </label>
      <textarea
        className="max-h-40 min-h-12 min-w-0 flex-1 resize-none overflow-y-auto rounded-md border border-slate-300 px-4 py-3 text-sm leading-6 outline-none transition disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        disabled={isSending}
        id="message"
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        ref={textareaRef}
        rows={1}
        value={message}
      />
      <button
        className="min-h-12 rounded-md bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
        disabled={!canSend}
        type="submit"
      >
        {isSending ? "Sending" : "Send"}
      </button>
    </form>
  );
}
