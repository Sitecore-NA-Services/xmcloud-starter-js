import { streamText, tool, type Message } from 'ai';
import { z } from 'zod';
import { chatModel } from '@/lib/azure-openai';
import { querySitecoreSearch, listSearchFacetValues, querySitecoreQuestions } from '@/lib/sitecore-search-query';
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
  const { messages, locale }: { messages: Message[]; locale?: string } = await req.json();

  // The Search index is language-scoped (an English query won't match Spanish
  // articles or vice versa), so the model needs to both answer and search in the
  // visitor's site language, not just whatever language they happened to type in.
  const languageNote =
    locale && locale.toLowerCase().startsWith('es')
      ? 'The visitor is on the Spanish (es-MX) site. Respond in Spanish, and phrase ' +
        'searchArticles/listArticleFacets queries in Spanish too (translate the topic ' +
        "first if the user asked in English), since the article index is Spanish-language."
      : 'The visitor is on the English site. Respond in English, and phrase searchArticles ' +
        'queries in English.';

  const result = streamText({
    model: chatModel,
    system:
      'You are a helpful assistant for the Solterra & Co. article site. ' +
      `${languageNote} ` +
      'When the user asks a direct question, call askKnowledgeBase first — those answers are ' +
      'editorially reviewed, so they are more trustworthy than raw article text. If it returns ' +
      'nothing useful, fall back to searchArticles. ' +
      'Use the searchArticles tool whenever the user asks about article content, ' +
      'topics, or facts that may be covered by the site. If the user wants to narrow ' +
      'results by content type, author, or topic, call listArticleFacets first to see the ' +
      'exact values available, then pass matching contentType/author/tags arguments to ' +
      'searchArticles. The query keyphrase is matched against article text semantically, so ' +
      'when filtering by author or content type, do NOT put the author name or content type ' +
      'in the query - use a topical keyword instead, or omit query entirely if the user just ' +
      "wants everything by that author/type. Cite article titles and URLs in your answer. If " +
      'the tool returns no results, say so honestly instead of guessing. Each result includes ' +
      'a relevanceScore (0-1, cosine similarity to the query); if the best results score below ' +
      'roughly 0.45, tell the user the match is weak rather than presenting it as a confident answer.',
    messages,
    tools: {
      listArticleFacets: tool({
        description:
          'List the available content type, author, and topic tag values in the Solterra ' +
          'article index, with result counts, so a search can be narrowed accurately.',
        parameters: z.object({}),
        execute: async () => listSearchFacetValues('the', locale),
      }),
      askKnowledgeBase: tool({
        description:
          'Ask the Solterra curated Q&A knowledge base a natural-language question. Returns an ' +
          'editorially reviewed answer plus related question/answer pairs. Prefer this over ' +
          'searchArticles when the user asks a direct question ("what is X", "how does Y work"), ' +
          'since these answers are reviewed by the site team. Falls back to empty when the ' +
          'knowledge base has nothing on the topic — use searchArticles then. English only.',
        parameters: z.object({
          question: z.string().describe("The user's question, phrased as a full question"),
        }),
        execute: async ({ question }) => querySitecoreQuestions(question, 4, locale),
      }),
      searchArticles: tool({
        description:
          'Search the Solterra article index for relevant content. Optionally narrow by ' +
          'content type, author, and/or topic tags (get exact values from listArticleFacets first). ' +
          'query is optional - omit it (or use a topical keyword, not the filter value itself) ' +
          'when browsing by author/content type/tags alone.',
        parameters: z.object({
          query: z.string().optional().describe('Search keyphrase (omit to just browse by filters)'),
          contentType: z.string().optional().describe('Filter to this exact content type value'),
          author: z.string().optional().describe('Filter to this exact author value'),
          tags: z.array(z.string()).optional().describe('Filter to articles tagged with any of these topics'),
        }),
        execute: async ({ query, contentType, author, tags }) => {
          const docs = await querySitecoreSearch(query ?? '', 5, { contentType, author, tags }, locale);
          // Rerank by embedding cosine similarity so the model (and the UI) sees a
          // relevanceScore per result.
          return rerankByRelevance(query ?? '', docs);
        },
      }),
    },
    maxSteps: 5,
  });

  return result.toDataStreamResponse();
}
