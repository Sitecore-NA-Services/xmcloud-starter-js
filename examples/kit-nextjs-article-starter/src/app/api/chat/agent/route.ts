import { streamText, tool } from 'ai';
import { z } from 'zod';
import { chatModel } from '@/lib/azure-openai';
import { querySitecoreSearch } from '@/lib/sitecore-search-query';

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
      'in your answer. If the tool returns no results, say so honestly instead of guessing.',
    messages,
    tools: {
      searchArticles: tool({
        description: 'Search the Solterra article index for relevant content.',
        parameters: z.object({ query: z.string().describe('Search keyphrase') }),
        execute: async ({ query }) => querySitecoreSearch(query, 5),
      }),
    },
    maxSteps: 5,
  });

  return result.toDataStreamResponse();
}
