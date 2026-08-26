'use client';

/**
 * Agentic search chat rendering: the LLM decides on its own when to call the
 * `searchArticles` tool (backed by the Sitecore Search index) rather than the
 * index being retrieved automatically for every message. Tool calls are shown
 * inline so visitors can see when/why the model searched.
 */

import { useChat } from 'ai/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Default: React.FC = () => {
  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    api: '/api/chat/agent',
  });

  const busy = status === 'streaming' || status === 'submitted';

  return (
    <section className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-10">
      <div>
        <h1 className="text-2xl font-semibold">Ask Solterra (Agent + Tools)</h1>
        <p className="text-muted-foreground text-sm">
          This assistant decides on its own when to search the Solterra article index.
        </p>
      </div>

      <div className="flex min-h-[300px] flex-col gap-3 rounded-xl border p-4">
        {messages.length === 0 && (
          <p className="text-muted-foreground text-sm">Ask a question about Solterra articles…</p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={m.role === 'user' ? 'text-right' : 'text-left'}>
            <div
              className={
                'inline-block max-w-[85%] rounded-lg px-3 py-2 text-sm ' +
                (m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')
              }
            >
              {m.parts?.map((part, i) => {
                if (part.type === 'text') return <span key={i}>{part.text}</span>;
                if (part.type === 'tool-invocation') {
                  const args = part.toolInvocation.args as { query?: string } | undefined;
                  return (
                    <div key={i} className="mt-1 rounded bg-black/10 px-2 py-1 text-xs italic">
                      🔎 searched articles for “{args?.query}”
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask about Solterra articles…"
          disabled={busy}
        />
        <Button type="submit" disabled={busy || !input.trim()}>
          Send
        </Button>
      </form>
    </section>
  );
};
