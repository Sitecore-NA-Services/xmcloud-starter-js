'use client';

/**
 * Sitecore Search "Questions and Answers" experience, packaged as a Sitecore
 * rendering (`Default` export) so it can be dropped on the `/search` page above
 * the results.
 *
 * How the capability works (see Search > Administration > Domain Settings >
 * Feature Configuration > Question & Answer Groups):
 *  - A Q&A *group* names the sources and the text attributes the generator reads.
 *    Saving a group auto-creates a `questions_answers` widget whose rfkId is
 *    `rfkid_<groupId>` — that is the id this component queries.
 *  - An *offline* batch job pre-generates the Q&A pairs from indexed documents
 *    (Content Collection > Question & Answer Groups > Run Batch Generation). The
 *    browser there is also where an editor curates or hides individual answers.
 *  - At query time the *online* engine tries to produce one `answer` — the exact
 *    answer for the visitor's question — and returns `related_questions` drawn
 *    from the pre-generated set.
 *
 * Notes:
 *  - Q&A is English-only today, so this renders nothing outside `en`.
 *  - The group config already scopes generation to this site's source, so unlike
 *    `SearchResults` there is no `setSources` call here — the questions widget
 *    ignores a request-level `sources` filter.
 *  - When the online engine cannot answer, the API returns error code 103
 *    (`machine_cannot_generate_answer`) and omits `answer`. That is an expected,
 *    non-fatal outcome: we just fall back to the related questions.
 */

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { cva } from 'class-variance-authority';
import { WidgetDataType, useQuestions, widget } from '@sitecore-search/react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { dictionaryKeys } from '@/variables/dictionary';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { ComponentProps } from '@/lib/component-props';
import { SEARCH_LANGUAGE } from './search-config';
import { useLocalizeHref } from '@/lib/localize-href';

/** Sitecore item path of the Agent Chat page. */
const AGENT_CHAT_PATH = '/Agent-Chat';

/**
 * Words that open a question. Used with a trailing "?" to decide whether a query
 * is worth spending a model call on — "solar panels" is a browse, "how do solar
 * panels work" is a question, and only the second deserves a written answer.
 */
const QUESTION_OPENERS =
  /^(who|what|when|where|why|how|which|is|are|was|were|do|does|did|can|could|should|would|will|has|have|had|am)\b/i;

/** True when the query reads as a question rather than a keyword browse. */
export const looksLikeQuestion = (q: string): boolean => {
  const trimmed = q.trim();
  if (trimmed.length < 8) return false;
  if (trimmed.endsWith('?')) return true;
  // Needs a few words behind it: "how" alone is a keyword, "how do I apply" is not.
  return QUESTION_OPENERS.test(trimmed) && trimmed.split(/\s+/).length >= 4;
};

/**
 * How long to wait for a written answer before giving up on it. This does NOT
 * hold up the page — the results list renders independently and the answer slots
 * in above it whenever it arrives — so the budget only exists to stop a stuck
 * request spinning forever. Measured end-to-end cost is ~3.5-4.5s warm (two model
 * round-trips with a search between them), so a 3s budget would discard almost
 * every answer.
 */
const ANSWER_TIMEOUT_MS = Number(process.env.NEXT_PUBLIC_SEARCH_ANSWER_TIMEOUT_MS) || 10000;

/** One generated Q&A pair, as returned by the questions widget. */
type QuestionAnswer = {
  id?: string;
  question?: string;
  answer?: string;
  type?: string;
};

type SearchQuestionsProps = {
  defaultKeyphrase: string;
  /**
   * Show the "People also ask" list of related pairs. Off by default: on the
   * search page the answer leads and the results list follows, so a second list
   * of questions in between just pushes the results down. Browsing related
   * questions belongs on an FAQ page.
   */
  showRelated?: boolean;
  relatedQuestions?: number;
};

type Translator = ReturnType<typeof useTranslations>;

/**
 * The Q&A dictionary items are new, so they may not exist in Sitecore yet. Fall
 * back to English copy rather than rendering a missing-key error into the page.
 */
const label = (t: Translator, key: string, fallback: string) =>
  t.has(key) ? t(key) : fallback;

const QuestionsSkeleton = () => (
  <div className="rounded-xl border border-zinc-200 bg-white p-5">
    <div className="h-4 w-24 animate-pulse rounded bg-zinc-200" />
    <div className="mt-3 h-5 w-3/4 animate-pulse rounded bg-zinc-200" />
    <div className="mt-3 h-4 w-full animate-pulse rounded bg-zinc-100" />
    <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-zinc-100" />
  </div>
);

const SearchQuestionsComponent = ({
  defaultKeyphrase,
  showRelated = false,
  relatedQuestions = 5,
}: SearchQuestionsProps) => {
  const t = useTranslations();
  const localizeHref = useLocalizeHref();
  const {
    widgetRef,
    actions: { onKeyphraseChanged },
    state: { keyphrase },
    queryResult: {
      isLoading,
      isFetching,
      data: { answer, related_questions: relatedRaw = [] } = {},
    },
  } = useQuestions<QuestionAnswer, { keyphrase: string; relatedQuestions: number }>({
    state: {
      keyphrase: defaultKeyphrase,
      relatedQuestions,
    },
  });

  // Like `useSearchResults`, the hook only applies `state.keyphrase` on first
  // init. Header submit is a same-route `?q=` change, so push later keyphrases
  // through the action or the widget keeps answering the first question asked.
  useEffect(() => {
    if ((defaultKeyphrase || '') === (keyphrase || '')) return;
    onKeyphraseChanged({ keyphrase: defaultKeyphrase });
  }, [defaultKeyphrase, keyphrase, onKeyphraseChanged]);

  const loading = isLoading || isFetching;
  // The SDK's response type omits the `id` the API returns on each pair, so widen
  // both to the shape actually on the wire.
  const related = showRelated ? (relatedRaw as Array<QuestionAnswer>) : [];
  const exact = answer as QuestionAnswer | undefined;

  // Fallback: no curated answer, but the visitor clearly asked something. Have the
  // model write a short answer grounded in the article index. Deliberately not run
  // for keyword browses — most searches are those, and a model call per search
  // would be both slow and pointless.
  // Tagged with the keyphrase it was produced for, so a result arriving after the
  // visitor has moved on is simply ignored rather than needing to be cleared —
  // which also keeps every setState below inside an async callback.
  const [result, setResult] = useState<{ q: string; answer: string | null } | null>(null);

  const needsGenerated = !loading && !exact?.answer && looksLikeQuestion(defaultKeyphrase);
  const settled = result?.q === defaultKeyphrase;
  const generated = settled ? result.answer : null;

  // `settled` deliberately stays out of the dependencies below: each streamed chunk
  // updates state, and if that re-ran the effect the cleanup would abort the very
  // stream being read. A ref records which keyphrase has already been started.
  const startedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!needsGenerated) return;
    if (startedRef.current === defaultKeyphrase) return;
    startedRef.current = defaultKeyphrase;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ANSWER_TIMEOUT_MS);
    let cancelled = false;

    (async () => {
      let accumulated = '';
      try {
        const res = await fetch('/api/search-answer', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ question: defaultKeyphrase }),
          signal: controller.signal,
        });
        if (res.ok && res.body) {
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            accumulated += decoder.decode(value, { stream: true });
            // Render as it arrives, so the answer forms in place rather than
            // appearing all at once several seconds later.
            if (!cancelled && accumulated) setResult({ q: defaultKeyphrase, answer: accumulated });
          }
        }
      } catch {
        // Aborted or failed: keep whatever already streamed in.
      }
      clearTimeout(timer);
      // An empty body is the "no answer" signal; settle so we stop waiting on it.
      if (!cancelled) setResult({ q: defaultKeyphrase, answer: accumulated.trim() || null });
    })();

    return () => {
      cancelled = true;
      clearTimeout(timer);
      controller.abort();
    };
  }, [needsGenerated, defaultKeyphrase]);

  const shownAnswer = exact?.answer ?? generated ?? undefined;
  const shownQuestion = exact?.question ?? defaultKeyphrase;
  const provenance = exact?.answer
    ? label(t, dictionaryKeys.SEARCH_QA_FROM_FAQ, 'FAQ Generated')
    : label(t, dictionaryKeys.SEARCH_QA_FROM_AI, 'AI Generated');
  const hasContent = !!shownAnswer || related.length > 0;

  // Only the Q&A widget blocks this panel. The written answer is fetched after
  // the page has rendered and slotted in when it arrives, so a slow model call
  // never delays the results underneath.
  if (loading) {
    return (
      <div ref={widgetRef}>
        <QuestionsSkeleton />
      </div>
    );
  }

  // No generated answer and nothing related: stay out of the way so the results
  // list keeps the full width of the page.
  if (!hasContent) return <div ref={widgetRef} />;

  return (
    <div ref={widgetRef} className="rounded-xl border border-zinc-200 bg-white p-5 md:p-6">
      {shownAnswer && (
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            {label(t, dictionaryKeys.SEARCH_QA_ANSWER_LABEL, 'Answer')}
            {/* Where this answer came from: the curated Q&A knowledge base, or the
                model writing one on the spot from the article index. Different
                things with different reliability, so say which. */}
            <span className="text-[10px] font-normal normal-case tracking-normal text-zinc-400">
              {provenance}
            </span>
          </p>
          {shownQuestion && (
            <h2 className="mt-2 text-lg font-semibold text-zinc-900">{shownQuestion}</h2>
          )}
          <p className="mt-2 text-sm leading-relaxed text-zinc-700">{shownAnswer}</p>

          {/* Hand the question off to the agent, which re-answers it with its own
              tools — the curated answer plus whatever articles it finds — so the
              visitor picks up where the short answer left off instead of
              retyping it. */}
          <Link
            href={`${localizeHref(AGENT_CHAT_PATH) ?? AGENT_CHAT_PATH}?q=${encodeURIComponent(
              shownQuestion,
            )}`}
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent underline underline-offset-2"
          >
            {label(t, dictionaryKeys.SEARCH_QA_CONTINUE, 'Continue this conversation')}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}

      {related.length > 0 && (
        <div className={cn(shownAnswer && 'mt-6 border-t border-zinc-200 pt-5')}>
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            {label(t, dictionaryKeys.SEARCH_QA_RELATED_LABEL, 'People also ask')}
          </p>
          <Accordion type="single" collapsible className="mt-2">
            {related.map((item, index) => (
              <AccordionItem key={item.id || index} value={item.id || String(index)}>
                <AccordionTrigger className="text-left text-sm font-medium text-zinc-900">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-zinc-700">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
};

const SearchQuestionsWidget = widget(
  SearchQuestionsComponent,
  WidgetDataType.QUESTIONS,
  'content',
);

const searchQuestionsVariants = cva('w-full py-6', {
  variants: {
    colorScheme: {
      light: 'bg-zinc-50 text-zinc-900',
      primary: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground',
      tertiary: 'bg-tertiary text-primary',
      dark: 'bg-dark text-primary',
    },
  },
  defaultVariants: {
    colorScheme: 'light',
  },
});

type ColorScheme = 'primary' | 'secondary' | 'tertiary' | 'dark' | 'light';

/**
 * Embeddable Q&A panel — the widget without any section chrome, so it can be
 * composed into another rendering (it sits above the list in `SearchResults`)
 * as well as stand alone as its own rendering.
 *
 * Renders nothing when there is no question to ask, when Search is
 * unconfigured, or outside English: a Q&A block with no question is just empty
 * chrome on the page.
 */
export const SearchQuestionsPanel = ({
  keyphrase,
  showRelated = false,
}: {
  keyphrase: string;
  showRelated?: boolean;
}) => {
  const rfkId = process.env.NEXT_PUBLIC_SEARCH_QUESTIONS_RFKID;
  const configured =
    !!process.env.NEXT_PUBLIC_SEARCH_ENV &&
    !!process.env.NEXT_PUBLIC_SEARCH_CUSTOMER_KEY &&
    !!process.env.NEXT_PUBLIC_SEARCH_API_KEY;

  // `keyphrase` has a minimum length of 1 — an empty query is an API error, not
  // a "browse all" request, so there is nothing to render until someone asks.
  if (!configured || !rfkId || !keyphrase.trim() || SEARCH_LANGUAGE !== 'en') return null;

  return (
    <SearchQuestionsWidget
      key={keyphrase}
      rfkId={rfkId}
      defaultKeyphrase={keyphrase}
      showRelated={showRelated}
    />
  );
};

/**
 * Sitecore rendering entry. Reads the `colorScheme` rendering parameter and the
 * `?q=` query string, and wraps the panel in a brand-styled section. Use this
 * when placing Q&A on a page as its own component; `SearchResults` embeds
 * `SearchQuestionsPanel` directly instead.
 *
 * Set the `showRelated` rendering parameter to "true" to include the related
 * questions list — intended for an FAQ page, where browsing questions is the
 * point, rather than the search page, where the results are.
 */
const SearchQuestionsContent = ({ params }: ComponentProps) => {
  const colorScheme = ((params?.colorScheme as ColorScheme) || 'light') as ColorScheme;
  const showRelated = String(params?.showRelated ?? '').toLowerCase() === 'true';
  const q = useSearchParams()?.get('q') ?? '';

  if (!q.trim()) return null;

  return (
    <section className={cn(searchQuestionsVariants({ colorScheme }), params?.styles)}>
      <div className="mx-auto w-full max-w-screen-xl px-4 xl:px-8">
        <SearchQuestionsPanel keyphrase={q} showRelated={showRelated} />
      </div>
    </section>
  );
};

export const Default = (props: ComponentProps) => (
  <Suspense fallback={null}>
    <SearchQuestionsContent {...props} />
  </Suspense>
);
