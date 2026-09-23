import { streamText } from 'ai';
import { chatModel } from '@/lib/azure-openai';
import { querySitecoreSearch } from '@/lib/sitecore-search-query';
import { rerankByRelevance, filterByRelevance } from '@/lib/rerank';

// The client abandons the request after ~10s, so there is no point letting a
// generation run for 30. Bounded so a stuck call cannot hold a function open.
export const maxDuration = 15;

/**
 * Fallback answer for the search page, used only when the Sitecore Search Q&A
 * knowledge base has no curated answer for a question-shaped query.
 *
 * Streams plain text: retrieval runs first, then a single model call writes the
 * answer, so the first words arrive while the rest is still being written rather
 * than the visitor staring at nothing — the same trick Google plays with AI
 * Overviews. An empty body means "no answer", and the panel renders nothing.
 *
 * Grounding is the whole point — an ungrounded guess next to the word "Answer"
 * on a search page would be worse than showing nothing. So the model only sees
 * the retrieved articles, weak matches are filtered out before it does, and it is
 * told to emit the NO_ANSWER sentinel when those articles fall short.
 */

/** Sentinel the model returns instead of guessing when the index falls short. */
const NO_ANSWER = 'NO_ANSWER';

const CACHE_TTL_MS = 60 * 60 * 1000;
/** Keeps the demo's repeated questions from paying for a fresh generation each time. */
const MAX_CACHE_ENTRIES = 200;

/**
 * Answers already generated, keyed by question + locale.
 *
 * This lives in the module, so it is per-instance and dies with a cold start —
 * it makes repeats cheap rather than guaranteeing a hit. A streamed response
 * cannot be stored in the Next.js Data Cache (that caches resolved values, and
 * waiting for the whole answer to resolve is exactly what streaming avoids), so
 * a shared cache would mean giving up streaming or adding Redis/KV.
 */
const answerCache = new Map<string, { answer: string; expires: number }>();

const cacheKey = (question: string, locale?: string) =>
  `${(locale || 'en').toLowerCase()}::${question.toLowerCase()}`;

function readCache(key: string): string | null {
  const hit = answerCache.get(key);
  if (!hit) return null;
  if (hit.expires <= Date.now()) {
    answerCache.delete(key);
    return null;
  }
  return hit.answer;
}

function writeCache(key: string, answer: string) {
  // Map preserves insertion order, so the first key is the oldest.
  if (answerCache.size >= MAX_CACHE_ENTRIES) {
    const oldest = answerCache.keys().next().value;
    if (oldest) answerCache.delete(oldest);
  }
  answerCache.set(key, { answer, expires: Date.now() + CACHE_TTL_MS });
}

const textHeaders = (cacheState: 'hit' | 'miss') => ({
  'content-type': 'text/plain; charset=utf-8',
  'cache-control': 'no-store',
  'x-answer-cache': cacheState,
});

export async function POST(req: Request) {
  const { question, locale }: { question?: string; locale?: string } = await req.json();
  const trimmed = question?.trim();
  if (!trimmed) return new Response('', { headers: textHeaders('miss') });

  const key = cacheKey(trimmed, locale);
  const cached = readCache(key);
  // A hit skips the model entirely and lands in one chunk, so a repeated question
  // renders instantly rather than forming again over four seconds.
  if (cached !== null) return new Response(cached, { headers: textHeaders('hit') });

  // Retrieve first, then make ONE model call with the articles already in the
  // prompt. Exposing this as a tool instead would cost an extra round-trip — the
  // model deciding to search, then waiting on it — before it can write a word,
  // which measured at ~7s to first byte and made streaming almost pointless. The
  // model has no judgement to exercise here anyway: this pipeline always searches.
  const docs = await querySitecoreSearch(trimmed, 5, undefined, locale);
  const ranked = await rerankByRelevance(trimmed, docs);
  // Drop weak matches before the model ever sees them, so a low-relevance result
  // can't be spun into a confident-sounding answer.
  const relevant = filterByRelevance(ranked);

  // Nothing relevant indexed: answer no without paying for a generation at all.
  if (!relevant.length) return new Response('', { headers: textHeaders('miss') });

  const languageNote =
    locale && locale.toLowerCase().startsWith('es') ? 'Respond in Spanish.' : 'Respond in English.';

  const articles = relevant
    .map((d, i) => `[${i + 1}] ${d.title}\n${d.description ?? ''}`)
    .join('\n\n');

  const result = streamText({
    model: chatModel,
    // Stop generating as soon as the browser disconnects — the answer is
    // non-blocking and discarded on timeout, so finishing it just costs money.
    abortSignal: req.signal,
    system:
      'You answer a visitor question on the Solterra & Co. search page, where your answer ' +
      'sits above the search results. ' +
      `${languageNote} ` +
      'Answer in AT MOST three sentences, plain prose, no markdown, no bullet points, ' +
      'no headings, and no links: the page renders your text as a single paragraph. ' +
      'Use ONLY facts present in the articles below. Do not add background knowledge ' +
      'of your own, even if you are confident it is correct. ' +
      `If the articles do not actually answer the question, reply with exactly ${NO_ANSWER} ` +
      'and nothing else. Prefer that over a vague or hedged answer — the page simply hides ' +
      'the panel, which is a better outcome than a weak one.\n\n' +
      `Articles:\n${articles}`,
    prompt: trimmed,
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      // Streaming and the NO_ANSWER sentinel conflict: text already sent cannot be
      // taken back. The sentinel is emitted alone and first, so hold the opening
      // characters until there are enough to recognise it, then let the rest flow
      // through untouched. The delay is one token.
      let pending = '';
      let flushed = false;
      let full = '';

      const flush = (text: string) => {
        if (!text) return;
        full += text;
        controller.enqueue(encoder.encode(text));
      };

      try {
        for await (const chunk of result.textStream) {
          if (flushed) {
            flush(chunk);
            continue;
          }
          pending += chunk;
          if (pending.trimStart().length < NO_ANSWER.length) continue;
          if (pending.trimStart().startsWith(NO_ANSWER)) {
            controller.close();
            return;
          }
          flushed = true;
          flush(pending);
          pending = '';
        }
        // The whole answer was shorter than the sentinel check needed.
        if (!flushed && !pending.trimStart().startsWith(NO_ANSWER)) flush(pending);

        const answer = full.trim();
        if (answer) writeCache(key, answer);
      } catch {
        // Aborted or failed mid-flight: keep whatever already reached the browser
        // rather than erroring out the search page.
      }
      controller.close();
    },
  });

  return new Response(stream, { headers: textHeaders('miss') });
}
