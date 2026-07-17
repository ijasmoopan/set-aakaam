"use client";

import { useState, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

type MarkdownProps = {
  content: string;
};

type TokenType =
  | "comment"
  | "function"
  | "keyword"
  | "number"
  | "property"
  | "string"
  | "tag";

const keywordPattern =
  /\b(?:abstract|async|await|boolean|break|case|catch|class|const|continue|def|default|do|else|enum|export|extends|false|finally|for|from|function|if|implements|import|in|interface|let|new|null|private|protected|public|return|static|string|switch|throw|true|try|type|undefined|var|void|while|yield)\b/;

const tokenClassNames: Record<TokenType, string> = {
  comment: "text-slate-500",
  function: "text-sky-300",
  keyword: "text-fuchsia-300",
  number: "text-amber-300",
  property: "text-cyan-200",
  string: "text-emerald-300",
  tag: "text-rose-300",
};

const languageLabels: Record<string, string> = {
  bash: "Bash",
  css: "CSS",
  html: "HTML",
  js: "JavaScript",
  json: "JSON",
  jsx: "JSX",
  markdown: "Markdown",
  md: "Markdown",
  py: "Python",
  python: "Python",
  sh: "Shell",
  shell: "Shell",
  ts: "TypeScript",
  tsx: "TSX",
  txt: "Text",
};

const getTextContent = (children: ReactNode): string => {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }

  if (Array.isArray(children)) {
    return children.map(getTextContent).join("");
  }

  return "";
};

const getTokenType = (token: string, language?: string): TokenType | null => {
  const normalizedLanguage = language?.toLowerCase();

  if (
    token.startsWith("//") ||
    token.startsWith("/*") ||
    token.startsWith("#") ||
    token.startsWith("<!--")
  ) {
    return "comment";
  }

  if (token.startsWith('"') || token.startsWith("'") || token.startsWith("`")) {
    return "string";
  }

  if (/^\d/.test(token)) {
    return "number";
  }

  if (/^<\/?[A-Za-z]/.test(token)) {
    return "tag";
  }

  if (/^[A-Za-z_$][\w$-]*(?=\s*=)/.test(token)) {
    return "property";
  }

  if (keywordPattern.test(token)) {
    return "keyword";
  }

  if (
    normalizedLanguage !== "json" &&
    /^[A-Za-z_$][\w$]*(?=\s*\()/.test(token)
  ) {
    return "function";
  }

  return null;
};

const highlightLine = (line: string, language?: string) => {
  const tokenPattern =
    /(<!--.*?-->|\/\/.*|\/\*.*?\*\/|#.*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|<\/?[A-Za-z][^>\s]*|[A-Za-z_$][\w$-]*(?=\s*=)|\b\d+(?:\.\d+)?\b|\b[A-Za-z_$][\w$]*(?=\s*\()|\b[A-Za-z_$][\w$]*\b)/g;
  const nodes: ReactNode[] = [];
  let cursor = 0;

  for (const match of line.matchAll(tokenPattern)) {
    const token = match[0];
    const index = match.index ?? 0;
    const tokenType = getTokenType(token, language);

    if (index > cursor) {
      nodes.push(line.slice(cursor, index));
    }

    nodes.push(
      tokenType ? (
        <span className={tokenClassNames[tokenType]} key={`${index}-${token}`}>
          {token}
        </span>
      ) : (
        token
      ),
    );

    cursor = index + token.length;
  }

  if (cursor < line.length) {
    nodes.push(line.slice(cursor));
  }

  return nodes.length ? nodes : " ";
};

function CodeBlock({
  children,
  language,
}: {
  children: ReactNode;
  language?: string;
}) {
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");
  const code = getTextContent(children).replace(/\n$/, "");
  const normalizedLanguage = language?.toLowerCase();
  const label = normalizedLanguage
    ? (languageLabels[normalizedLanguage] ?? normalizedLanguage.toUpperCase())
    : "Code";

  const handleCopy = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(code);
    } else {
      const textarea = document.createElement("textarea");

      textarea.value = code;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    setCopyState("copied");
    window.setTimeout(() => setCopyState("idle"), 1600);
  };

  return (
    <div className="mb-3 overflow-hidden rounded-md bg-slate-950 text-slate-100 last:mb-0">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
        <span className="font-mono text-[0.68rem] font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </span>
        <button
          className="rounded border border-white/10 px-2 py-1 text-[0.68rem] font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
          onClick={handleCopy}
          type="button"
        >
          {copyState === "copied" ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-3 font-mono text-xs leading-5">
        <code className="block whitespace-pre">
          {code.split("\n").map((line, index) => (
            <span className="block min-h-5" key={index}>
              {highlightLine(line, normalizedLanguage)}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

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
    const language = className?.match(/language-(\S+)/)?.[1];
    const code = getTextContent(children);

    if (language || code.includes("\n")) {
      return <CodeBlock language={language}>{children}</CodeBlock>;
    }

    return (
      <code className="rounded bg-black/10 px-1.5 py-0.5 font-mono text-[0.92em]">
        {children}
      </code>
    );
  },
  pre: ({ children }) => <>{children}</>,
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
