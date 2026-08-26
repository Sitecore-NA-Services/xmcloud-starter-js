import { streamText, type Message } from 'ai';
import { chatModel } from '@/lib/azure-openai';
import { querySitecoreSearch } from '@/lib/sitecore-search-query';

export const maxDuration = 30;

/**
 * RAG chat: every request retrieves top-k documents from the Sitecore Search
 * index for the latest user message and grounds the model's answer in that
 * context, rather than letting the model decide whether to search
 * (compare with /api/chat/agent).
 */
export async function POST(req: Request) {
  const { messages }: { messages: Message[] } = await req.json();
  const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
  const keyphrase = lastUserMessage?.content ?? '';

  const docs = await querySitecoreSearch(keyphrase, 5);
  const context = docs.length
    ? docs
        .map((d, i) => `[${i + 1}] ${d.title}\n${d.description ?? ''}\nURL: ${d.url ?? ''}`)
        .join('\n\n')
    : 'No matching articles were found in the index.';

  const result = streamText({
    model: chatModel,
    system:
      'You are a helpful assistant for the Solterra & Co. article site. ' +
      'Answer ONLY using the retrieved context below. If the context does not contain ' +
      'the answer, say you do not have that information. Cite sources by title and URL.\n\n' +
      `Retrieved context:\n${context}`,
    messages,
  });

  return result.toDataStreamResponse();
}
