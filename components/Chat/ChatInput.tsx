export function ChatInput() {
  return (
    <form className="flex gap-3 border-t border-slate-200 bg-white p-4">
      <label className="sr-only" htmlFor="message">
        Message
      </label>
      <input
        className="min-w-0 flex-1 rounded-md border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        id="message"
        placeholder="Type a message..."
        type="text"
      />
      <button
        className="rounded-md bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
        type="submit"
      >
        Send
      </button>
    </form>
  );
}
