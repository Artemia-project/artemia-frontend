import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  content, 
  className = '' 
}) => {
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Headings
          h1: ({ children }) => (
            <h1 className="text-2xl font-light mb-4 text-foreground border-b border-border pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-light mb-3 mt-6 text-foreground">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-light mb-2 mt-4 text-foreground">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-light mb-2 mt-3 text-foreground">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-sm font-light mb-2 mt-3 text-foreground">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-sm font-light mb-2 mt-3 text-muted-foreground">
              {children}
            </h6>
          ),
          
          // Paragraphs
          p: ({ children }) => (
            <p className="mb-4 last:mb-0 leading-relaxed text-foreground">
              {children}
            </p>
          ),
          
          // Lists
          ul: ({ children }) => (
            <ul className="mb-4 space-y-1 list-disc list-inside pl-2 text-foreground">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 space-y-1 list-decimal list-inside pl-2 text-foreground">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-foreground leading-relaxed">
              {children}
            </li>
          ),
          
          // Code
          code: ({ inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <div className="my-4 relative">
                <div className="absolute top-2 right-2 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  {match[1]}
                </div>
                <pre className="bg-muted/30 border border-border rounded-lg p-4 overflow-x-auto">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            ) : (
              <code 
                className="bg-muted/50 text-muted-foreground px-1.5 py-0.5 rounded text-sm font-mono border"
                {...props}
              >
                {children}
              </code>
            );
          },
          
          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary/50 bg-muted/20 pl-4 py-2 my-4 italic text-muted-foreground">
              {children}
            </blockquote>
          ),
          
          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 underline underline-offset-2 font-light transition-colors"
            >
              {children}
            </a>
          ),
          
          // Tables
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto">
              <table className="min-w-full border border-border rounded-lg overflow-hidden">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted/30">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-border">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-muted/10 transition-colors">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2 text-left text-sm font-light text-foreground border-r border-border last:border-r-0">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 text-sm text-foreground border-r border-border last:border-r-0">
              {children}
            </td>
          ),
          
          // Horizontal rule
          hr: () => (
            <hr className="my-6 border-t border-border" />
          ),
          
          // Strong/Bold
          strong: ({ children }) => (
            <strong className="font-light text-foreground">
              {children}
            </strong>
          ),
          
          // Emphasis/Italic
          em: ({ children }) => (
            <em className="italic text-foreground">
              {children}
            </em>
          ),
          
          // Strikethrough
          del: ({ children }) => (
            <del className="line-through text-muted-foreground">
              {children}
            </del>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};