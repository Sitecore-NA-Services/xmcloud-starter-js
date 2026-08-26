'use client';

/**
 * RAG chat rendering: every message automatically retrieves top-k documents
 * from the Sitecore Search index and grounds the model's answer in that
 * context server-side (see /api/chat/rag), with no tool-calling decision
 * made by the model.
 */

import { useChat } from '@ai-sdk/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Default: React.FC = () => {
  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    api: '/api/chat/rag',
  });

  const busy = status === 'streaming' || status === 'submitted';

  return (
    <section className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-10">
      <div>
        <h1 className="text-2xl font-semibold">Ask Solterra (RAG)</h1>
        <p className="text-muted-foreground text-sm">
          Every question is automatically grounded in the Solterra article index before the
          assistant answers.
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
              {m.content}
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
            <strong>Retrieval-Augmented Generation (RAG)</strong>: before the LLM ever sees your
            question, the server queries the Sitecore Search index for the top matching articles.
          </li>
          <li>
            Those results are inserted into the model&apos;s system prompt as retrieved context, and
            the model is instructed to answer <strong>only</strong> from that context — reducing
            hallucination and keeping answers grounded in real site content.
          </li>
          <li>
            Retrieval always happens, on every message — there is no decision step. This makes
            RAG predictable and easy to reason about (and to add citations/guardrails to).
          </li>
          <li>
            If the index has no relevant articles, the model is told so explicitly and will say it
            doesn&apos;t have that information rather than guessing.
          </li>
          <li>
            Compare with the <strong>Agent Chat</strong> page, where the model itself decides
            whether to call a search tool at all.
          </li>
        </ul>
      </div>
    </section>
  );
};
