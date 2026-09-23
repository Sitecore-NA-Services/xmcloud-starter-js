import { generateText, tool } from 'ai';
import { z } from 'zod';
import { chatModel } from '@/lib/azure-openai';
import { querySitecoreSearch } from '@/lib/sitecore-search-query';
import { rerankByRelevance, filterByRelevance } from '@/lib/rerank';

export const maxDuration = 30;

/**
 * Fallback answer for the search page, used only when the Sitecore Search Q&A
 * knowledge base has no curated answer for a question-shaped query.
 *
 * Unlike /api/chat/agent this is a single non-streaming turn: the panel shows a
 * short paragraph, not a conversation, so there is nothing to stream into and a
 * plain JSON response keeps the component simple.
 *
 * Grounding is the whole point — an ungrounded guess next to the word "Answer"
 * on a search page would be worse than showing nothing. So the model may only
 * use what `searchArticles` returns, and is told to emit the NO_ANSWER sentinel
 * when the index does not cover the question. That sentinel becomes
 * `{ answer: null }` and the panel renders nothing at all.
 */

/** Sentinel the model returns instead of guessing when the index falls short. */
const NO_ANSWER = 'NO_ANSWER';

export async function POST(req: Request) {
  const { question, locale }: { question?: string; locale?: string } = await req.json();
  const trimmed = question?.trim();
  if (!trimmed) return Response.json({ answer: null, sources: [] });

  // Collected from the tool so the answer can cite what it was actually built
  // from, rather than trusting the model to repeat URLs accurately.
  const used: Array<{ id: string; title: string; url?: string; relevanceScore?: number }> = [];

  const languageNote =
    locale && locale.toLowerCase().startsWith('es')
      ? 'Respond in Spanish, and phrase searchArticles queries in Spanish.'
      : 'Respond in English.';

  try {
    const { text } = await generateText({
      model: chatModel,
      maxSteps: 3,
      system:
        'You answer a visitor question on the Solterra & Co. search page, where your answer ' +
        'sits above the search results. ' +
        `${languageNote} ` +
        'Call searchArticles first — you have no knowledge of this site otherwise. ' +
        'Then answer in AT MOST three sentences, plain prose, no markdown, no bullet points, ' +
        'no headings, and no links: the page renders your text as a single paragraph. ' +
        'Use ONLY facts present in the retrieved articles. Do not add background knowledge ' +
        'of your own, even if you are confident it is correct. ' +
        `If the retrieved articles do not actually answer the question, reply with exactly ${NO_ANSWER} ` +
        'and nothing else. Prefer that over a vague or hedged answer — the page simply hides ' +
        'the panel, which is a better outcome than a weak one.',
      prompt: trimmed,
      tools: {
        searchArticles: tool({
          description: 'Search the Solterra article index for content relevant to the question.',
          parameters: z.object({
            query: z.string().describe('Search keyphrase'),
          }),
          execute: async ({ query }) => {
            const docs = await querySitecoreSearch(query, 5, undefined, locale);
            const ranked = await rerankByRelevance(query, docs);
            // Drop weak matches before the model ever sees them, so a low-relevance
            // result can't be spun into a confident-sounding answer.
            const relevant = filterByRelevance(ranked);
            for (const d of relevant) {
              if (!used.some((u) => u.id === d.id)) used.push(d);
            }
            return relevant.map(({ id, title, description, url, relevanceScore }) => ({
              id,
              title,
              description,
              url,
              relevanceScore,
            }));
          },
        }),
      },
    });

    const answer = text?.trim();
    if (!answer || answer.includes(NO_ANSWER)) {
      return Response.json({ answer: null, sources: [] });
    }

    return Response.json({
      answer,
      sources: used.slice(0, 3).map(({ id, title, url }) => ({ id, title, url: url ?? null })),
    });
  } catch {
    // A failed generation must not break the search page; the panel just stays hidden.
    return Response.json({ answer: null, sources: [] });
  }
}
