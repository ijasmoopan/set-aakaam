import ReactMarkdown, { type Components } from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

type MarkdownProps = {
  content: string;
};

const markdownComponents: Components = {
  p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
  ul: ({ children }) => (
    <ul className="mb-3 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-3 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>
  ),
  li: ({ children }) => <li className="pl-1">{children}</li>,
  a: ({ children, href }) => (
    <a
      className="font-medium underline underline-offset-2"
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mb-3 border-l-4 border-current/30 pl-3 italic last:mb-0">
      {children}
    </blockquote>
  ),
  code: ({ children, className }) => {
    const isCodeBlock = className?.startsWith("language-");

    if (isCodeBlock) {
      return (
        <code className={`${className} block overflow-x-auto whitespace-pre`}>
          {children}
        </code>
      );
    }

    return (
      <code className="rounded bg-black/10 px-1.5 py-0.5 font-mono text-[0.92em]">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="mb-3 overflow-x-auto rounded-md bg-slate-950 p-3 font-mono text-xs leading-5 text-slate-100 last:mb-0">
      {children}
    </pre>
  ),
};

export function Markdown({ content }: MarkdownProps) {
  return (
    <div className="wrap-break-word">
      <ReactMarkdown
        components={markdownComponents}
        remarkPlugins={[remarkGfm, remarkBreaks]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
