import ReactMarkdown, { type Components } from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

type MarkdownProps = {
  content: string;
};

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="mb-3 text-lg font-semibold leading-7 last:mb-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-3 text-base font-semibold leading-6 last:mb-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-2 text-sm font-semibold leading-6 last:mb-0">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="mb-2 text-sm font-semibold leading-6 last:mb-0">
      {children}
    </h4>
  ),
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
  table: ({ children }) => (
    <div className="mb-3 overflow-x-auto last:mb-0">
      <table className="w-full min-w-max border-collapse text-left text-xs">
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-current/20 bg-black/5 px-3 py-2 font-semibold">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-current/20 px-3 py-2 align-top">{children}</td>
  ),
  hr: () => <hr className="my-4 border-current/20" />,
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
