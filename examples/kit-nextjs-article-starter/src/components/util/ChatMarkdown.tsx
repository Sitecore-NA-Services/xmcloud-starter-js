'use client';

/**
 * Shared markdown renderer for the Agent Chat / RAG Chat demo messages, so
 * assistant replies (headings, bold, lists, and article links) render as
 * actual formatted HTML instead of raw markdown text.
 */

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type ChatMarkdownProps = {
  content: string;
};

export const ChatMarkdown: React.FC<ChatMarkdownProps> = ({ content }) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      a: ({ ...props }) => (
        // eslint-disable-next-line jsx-a11y/anchor-has-content
        <a {...props} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2" />
      ),
      p: ({ ...props }) => <p {...props} className="mb-3 last:mb-0" />,
      ul: ({ ...props }) => <ul {...props} className="mb-3 list-disc space-y-1 pl-5 last:mb-0" />,
      ol: ({ ...props }) => <ol {...props} className="mb-3 list-decimal space-y-1 pl-5 last:mb-0" />,
      li: ({ ...props }) => <li {...props} className="leading-snug" />,
      h1: ({ ...props }) => <h3 {...props} className="mt-3 mb-1.5 text-base font-semibold first:mt-0" />,
      h2: ({ ...props }) => <h3 {...props} className="mt-3 mb-1.5 text-base font-semibold first:mt-0" />,
      h3: ({ ...props }) => <h3 {...props} className="mt-3 mb-1.5 text-sm font-semibold first:mt-0" />,
      strong: ({ ...props }) => <strong {...props} className="font-semibold" />,
      code: ({ ...props }) => <code {...props} className="rounded bg-black/10 px-1 py-0.5 text-xs" />,
      hr: ({ ...props }) => <hr {...props} className="my-3 border-black/10" />,
    }}
  >
    {content}
  </ReactMarkdown>
);
