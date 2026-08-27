import { streamText, StreamData, type Message } from 'ai';
import { chatModel } from '@/lib/azure-openai';
import { querySitecoreSearch } from '@/lib/sitecore-search-query';
import { rerankByRelevance, filterByRelevance } from '@/lib/rerank';

export const maxDuration = 30;

/**
 * RAG chat: every request retrieves top-k documents from the Sitecore Search
 * index for the latest user message and grounds the model's answer in that
 * context, rather than letting the model decide whether to search
 * (compare with /api/chat/agent). Results are reranked by embedding cosine
 * similarity and filtered by RAG_RELEVANCE_THRESHOLD before being used as
 * context, since Sitecore Search doesn't expose its own relevance score.
 */
export async function POST(req: Request) {
  const { messages, locale }: { messages: Message[]; locale?: string } = await req.json();
  const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
  const keyphrase = lastUserMessage?.content ?? '';

  const rawDocs = await querySitecoreSearch(keyphrase, 5, undefined, locale);
  const rankedDocs = await rerankByRelevance(keyphrase, rawDocs);
  const docs = filterByRelevance(rankedDocs);

  const context = docs.length
    ? docs
        .map((d, i) => {
          const score = d.relevanceScore !== undefined ? ` (relevance: ${(d.relevanceScore * 100).toFixed(0)}%)` : '';
          return `[${i + 1}]${score} ${d.title}\n${d.description ?? ''}\nURL: ${d.url ?? ''}`;
        })
        .join('\n\n')
    : 'No matching articles were found in the index.';

  // The retrieved context is in whichever language the Search index returned it in
  // (locale-scoped), so the answer should match that same site language.
  const languageNote =
    locale && locale.toLowerCase().startsWith('es')
      ? 'The visitor is on the Spanish (es-MX) site; respond in Spanish.'
      : 'The visitor is on the English site; respond in English.';

  // Stream the reranked sources to the client alongside the answer so the UI can
  // show what was actually retrieved and how relevant each source scored.
  // StreamData requires plain JSON (no `undefined`), so normalize missing fields to null.
  const data = new StreamData();
  data.append({
    sources: docs.map(({ id, title, url, relevanceScore }) => ({
      id,
      title,
      url: url ?? null,
      relevanceScore: relevanceScore ?? null,
    })),
  });

  const result = streamText({
    model: chatModel,
    system:
      'You are a helpful assistant for the Solterra & Co. article site. ' +
      `${languageNote} ` +
      'Answer ONLY using the retrieved context below. If the context does not contain ' +
      'the answer, say you do not have that information. Cite sources by title and URL.\n\n' +
      `Retrieved context:\n${context}`,
    messages,
    onFinish: () => {
      data.close();
    },
  });

  return result.toDataStreamResponse({ data });
}
