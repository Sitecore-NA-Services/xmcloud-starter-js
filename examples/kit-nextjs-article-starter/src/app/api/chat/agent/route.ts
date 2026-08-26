import { streamText, tool } from 'ai';
import { z } from 'zod';
import { chatModel } from '@/lib/azure-openai';
import { querySitecoreSearch } from '@/lib/sitecore-search-query';
import { rerankByRelevance } from '@/lib/rerank';

export const maxDuration = 30;

/**
 * Agentic search chat: the model decides on its own when to call the
 * `searchArticles` tool against the Sitecore Search index, rather than the
 * index being retrieved automatically (compare with /api/chat/rag).
 */
export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: chatModel,
    system:
      'You are a helpful assistant for the Solterra & Co. article site. ' +
      'Use the searchArticles tool whenever the user asks about article content, ' +
      'topics, or facts that may be covered by the site. Cite article titles and URLs ' +
      'in your answer. If the tool returns no results, say so honestly instead of guessing. ' +
      'Each result includes a relevanceScore (0-1, cosine similarity to the query); if the ' +
      'best results score below roughly 0.75, tell the user the match is weak rather than ' +
      'presenting it as a confident answer.',
    messages,
    tools: {
      searchArticles: tool({
        description: 'Search the Solterra article index for relevant content.',
        parameters: z.object({ query: z.string().describe('Search keyphrase') }),
        execute: async ({ query }) => {
          const docs = await querySitecoreSearch(query, 5);
          // Rerank by embedding cosine similarity so the model (and the UI) sees a
          // relevanceScore per result, since Sitecore Search doesn't expose one itself.
          return rerankByRelevance(query, docs);
        },
      }),
    },
    maxSteps: 5,
  });

  return result.toDataStreamResponse();
}
