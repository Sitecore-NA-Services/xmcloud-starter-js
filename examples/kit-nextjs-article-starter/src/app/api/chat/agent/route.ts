import { streamText, tool } from 'ai';
import { z } from 'zod';
import { chatModel } from '@/lib/azure-openai';
import { querySitecoreSearch, listSearchFacetValues } from '@/lib/sitecore-search-query';
import { rerankByRelevance } from '@/lib/rerank';

export const maxDuration = 30;

/**
 * Agentic search chat: the model decides on its own when to call the
 * `searchArticles` tool against the Sitecore Search index, rather than the
 * index being retrieved automatically (compare with /api/chat/rag). It can
 * also call `listArticleFacets` to discover valid content type / author / tag
 * filter values before narrowing a search with them.
 */
export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: chatModel,
    system:
      'You are a helpful assistant for the Solterra & Co. article site. ' +
      'Use the searchArticles tool whenever the user asks about article content, ' +
      'topics, or facts that may be covered by the site. If the user wants to narrow ' +
      'results by content type, author, or topic, call listArticleFacets first to see the ' +
      'exact values available, then pass matching contentType/author/tags arguments to ' +
      'searchArticles. Cite article titles and URLs in your answer. If the tool returns no ' +
      'results, say so honestly instead of guessing. Each result includes a relevanceScore ' +
      '(0-1, cosine similarity to the query); if the best results score below roughly 0.75, ' +
      'tell the user the match is weak rather than presenting it as a confident answer.',
    messages,
    tools: {
      listArticleFacets: tool({
        description:
          'List the available content type, author, and topic tag values in the Solterra ' +
          'article index, with result counts, so a search can be narrowed accurately.',
        parameters: z.object({}),
        execute: async () => listSearchFacetValues(),
      }),
      searchArticles: tool({
        description:
          'Search the Solterra article index for relevant content. Optionally narrow by ' +
          'content type, author, and/or topic tags (get exact values from listArticleFacets first).',
        parameters: z.object({
          query: z.string().describe('Search keyphrase'),
          contentType: z.string().optional().describe('Filter to this exact content type value'),
          author: z.string().optional().describe('Filter to this exact author value'),
          tags: z.array(z.string()).optional().describe('Filter to articles tagged with any of these topics'),
        }),
        execute: async ({ query, contentType, author, tags }) => {
          const docs = await querySitecoreSearch(query, 5, { contentType, author, tags });
          // Rerank by embedding cosine similarity so the model (and the UI) sees a
          // relevanceScore per result.
          return rerankByRelevance(query, docs);
        },
      }),
    },
    maxSteps: 5,
  });

  return result.toDataStreamResponse();
}
