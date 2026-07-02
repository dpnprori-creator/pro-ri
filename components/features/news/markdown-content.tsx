import ReactMarkdown from "react-markdown";

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="prose prose-invert max-w-none text-sm text-pri-silver leading-relaxed">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold text-white mt-8 mb-4">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-bold text-white mt-6 mb-3">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold text-white mt-5 mb-2">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="mb-4 text-pri-silver leading-relaxed">{children}</p>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pri-red hover:text-red-400 underline underline-offset-2"
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-4 space-y-1 text-pri-silver">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-4 space-y-1 text-pri-silver">{children}</ol>
          ),
          li: ({ children }) => <li className="text-pri-silver">{children}</li>,
          code: ({ children }) => (
            <code className="bg-pri-dark/80 px-1.5 py-0.5 rounded text-sm font-mono text-pri-red">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="bg-pri-dark/80 p-4 rounded-lg overflow-x-auto mb-4 border border-white/5">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-pri-red/50 pl-4 italic text-pri-silver mb-4">
              {children}
            </blockquote>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-white">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          hr: () => <hr className="border-white/10 my-8" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
