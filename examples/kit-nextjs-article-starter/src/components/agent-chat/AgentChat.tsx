'use client';

/**
 * Agentic search chat rendering: the LLM decides on its own when to call the
 * `searchArticles` tool (backed by the Sitecore Search index) rather than the
 * index being retrieved automatically for every message. Tool calls are shown
 * inline so visitors can see when/why the model searched.
 */

import { useChat } from '@ai-sdk/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatMarkdown } from '@/components/util/ChatMarkdown';

type ToolSearchResult = { id: string; title: string; url?: string; relevanceScore?: number };
type FacetValues = { contentTypes: string[]; authors: string[]; tags: string[] };

const relevanceLabel = (score?: number) =>
  score === undefined ? null : `${Math.round(score * 100)}% match`;

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
                'inline-block max-w-[90%] rounded-lg px-4 py-3 text-sm ' +
                (m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')
              }
            >
              {m.toolInvocations?.map((ti) => {
                if (ti.toolName === 'listArticleFacets') {
                  const facets = ti.state === 'result' ? (ti.result as FacetValues | undefined) : undefined;
                  return (
                    <div key={ti.toolCallId} className="mb-1 rounded bg-black/10 px-2 py-1 text-xs italic">
                      <div>📋 looked up available filters</div>
                      {facets ? (
                        <ul className="mt-1 space-y-0.5 not-italic">
                          <li>Content types: {facets.contentTypes.join(', ') || '—'}</li>
                          <li>Authors: {facets.authors.join(', ') || '—'}</li>
                          <li>Tags: {facets.tags.join(', ') || '—'}</li>
                        </ul>
                      ) : null}
                    </div>
                  );
                }
                const args = ti.args as { query?: string; contentType?: string; author?: string; tags?: string[] } | undefined;
                const results = ti.state === 'result' ? (ti.result as ToolSearchResult[] | undefined) : undefined;
                const filterBits = [
                  args?.contentType && `type: ${args.contentType}`,
                  args?.author && `author: ${args.author}`,
                  args?.tags?.length && `tags: ${args.tags.join(', ')}`,
                ].filter(Boolean);
                return (
                  <div key={ti.toolCallId} className="mb-1 rounded bg-black/10 px-2 py-1 text-xs italic">
                    <div>
                      {args?.query ? <>🔎 searched articles for “{args.query}”</> : '🔎 browsed articles'}
                      {filterBits.length ? ` (${filterBits.join('; ')})` : ''}
                    </div>
                    {results?.length ? (
                      <ul className="mt-1 space-y-0.5 not-italic">
                        {results.map((r) => (
                          <li key={r.id} className="flex items-center gap-2">
                            <span className="rounded bg-black/20 px-1.5 py-0.5 font-mono">
                              {relevanceLabel(r.relevanceScore)}
                            </span>
                            <span>{r.title}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                );
              })}
              {m.content && (m.role === 'assistant' ? <ChatMarkdown content={m.content} /> : m.content)}
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
            The LLM (Azure OpenAI) is given two <strong>tools</strong>: <code>listArticleFacets</code>,
            which discovers the exact content type, author, and topic values available in the
            index, and <code>searchArticles</code>, which queries the index by keyphrase and can
            optionally filter by any of those facets.
          </li>
          <li>
            The model decides <strong>for itself</strong>, turn by turn, whether a question needs a
            search, and whether it should look up filter values first (e.g. &quot;articles by
            Jordan Alvarez about microgrids&quot; triggers a facet lookup, then a filtered search).
          </li>
          <li>
            Each tool call and its results are visible in the chat above (the “🔎 searched
            articles for…” and “📋 looked up available filters” badges), so you can see exactly
            when and why the model reached for the index.
          </li>
          <li>
            Each result shows a <strong>relevance score</strong> (0-100%) computed by embedding the
            query and each result, then measuring cosine similarity between them, giving the
            model (and you) a clear signal of match quality rather than trusting result order alone.
          </li>
          <li>
            This pattern (&quot;agentic search&quot;/&quot;function calling&quot;) is best when the assistant
            has several possible tools/actions and needs judgment about which to use, or none at
            all.
          </li>
          <li>
            Compare with the{' '}
            <Link href="/RAG-Chat" className="font-semibold text-foreground underline underline-offset-2">
              RAG Chat
            </Link>{' '}
            page, where retrieval always runs
            automatically before every answer instead of being a model decision.
          </li>
        </ul>
      </div>
    </section>
  );
};
