type MarkdownProps = {
  content: string;
};

export function Markdown({ content }: MarkdownProps) {
  return <p className="whitespace-pre-wrap">{content}</p>;
}
