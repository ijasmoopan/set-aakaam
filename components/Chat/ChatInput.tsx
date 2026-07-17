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
  onStop?: () => void;
};

export function ChatInput({
  isSending = false,
  onSend,
  onStop,
}: ChatInputProps) {
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
      aria-label="Message composer"
      className="flex flex-col gap-3 border-t border-slate-200/80 bg-white/95 p-3 backdrop-blur sm:flex-row sm:items-end sm:p-4 dark:border-white/10 dark:bg-slate-950/95"
      onSubmit={handleSubmit}
    >
      <label className="sr-only" htmlFor="message">
        Message
      </label>
      <textarea
        aria-describedby="composer-hint"
        className="max-h-40 min-h-12 min-w-0 flex-1 resize-none overflow-y-auto rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition duration-200 placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 focus:border-slate-500 focus:ring-4 focus:ring-slate-200 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:disabled:bg-white/5 dark:disabled:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-700/60"
        disabled={isSending}
        id="message"
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        ref={textareaRef}
        rows={1}
        value={message}
      />
      <div className="flex items-center gap-2 sm:self-end">
        <p className="sr-only" id="composer-hint">
          Press Enter to send. Press Shift and Enter for a new line.
        </p>
        <span
          aria-hidden="true"
          className="mr-auto text-xs text-slate-500 sm:hidden dark:text-slate-400"
        >
          Enter sends
        </span>
        {isSending ? (
          <button
            className="min-h-12 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 active:translate-y-0 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
            onClick={onStop}
            type="button"
          >
            Stop
          </button>
        ) : (
          <button
            className="min-h-12 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 active:translate-y-0 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 dark:disabled:bg-white/10 dark:disabled:text-slate-500"
            disabled={!canSend}
            type="submit"
          >
            Send
          </button>
        )}
      </div>
    </form>
  );
}
