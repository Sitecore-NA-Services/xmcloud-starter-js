'use client';

/**
 * Agentic search chat rendering: the LLM decides on its own when to call the
 * `searchArticles` tool (backed by the Sitecore Search index) rather than the
 * index being retrieved automatically for every message. Tool calls are shown
 * inline so visitors can see when/why the model searched.
 */

import { useChat } from '@ai-sdk/react';
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

      <div className="mt-6 rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
        <h2 className="mb-2 font-semibold text-foreground">How this demo works</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            The LLM (Azure OpenAI) is given one <strong>tool</strong>: <code>searchArticles</code>,
            which queries the Sitecore Search index for this site.
          </li>
          <li>
            The model decides <strong>for itself</strong>, turn by turn, whether a question needs a
            search. Simple chit-chat gets answered directly; a question about article content
            triggers a tool call first.
          </li>
          <li>
            Each tool call and its results are visible in the chat above (the “🔎 searched
            articles for…” badges), so you can see exactly when and why the model reached for
            the index.
          </li>
          <li>
            This pattern (&quot;agentic search&quot;/&quot;function calling&quot;) is best when the assistant
            has several possible tools/actions and needs judgment about which to use, or none at
            all.
          </li>
          <li>
            Compare with the <strong>RAG Chat</strong> page, where retrieval always runs
            automatically before every answer instead of being a model decision.
          </li>
        </ul>
      </div>
    </section>
  );
};
