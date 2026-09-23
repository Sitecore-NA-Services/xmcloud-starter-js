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

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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

/** One generated Q&A pair, as returned by the questions widget. */
type QuestionAnswer = {
  id?: string;
  question?: string;
  answer?: string;
  type?: string;
};

type SearchQuestionsProps = {
  defaultKeyphrase: string;
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
  relatedQuestions = 5,
}: SearchQuestionsProps) => {
  const t = useTranslations();
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
  const related = relatedRaw as Array<QuestionAnswer>;
  const exact = answer as QuestionAnswer | undefined;
  const hasContent = !!exact?.answer || related.length > 0;

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
      {exact?.answer && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            {label(t, dictionaryKeys.SEARCH_QA_ANSWER_LABEL, 'Answer')}
          </p>
          {exact.question && (
            <h2 className="mt-2 text-lg font-semibold text-zinc-900">{exact.question}</h2>
          )}
          <p className="mt-2 text-sm leading-relaxed text-zinc-700">{exact.answer}</p>
        </div>
      )}

      {related.length > 0 && (
        <div className={cn(exact?.answer && 'mt-6 border-t border-zinc-200 pt-5')}>
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

      <p className="mt-4 text-xs text-zinc-400">
        {label(
          t,
          dictionaryKeys.SEARCH_QA_SOURCE_NOTE,
          'AI-generated from this site’s content.',
        )}
      </p>
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
 * Sitecore rendering entry. Reads the `colorScheme` rendering parameter and the
 * `?q=` query string. Renders nothing at all when there is no question to ask,
 * when Search is unconfigured, or outside English — a Q&A block with no question
 * is just empty chrome on the page.
 */
const SearchQuestionsContent = ({ params }: ComponentProps) => {
  const colorScheme = ((params?.colorScheme as ColorScheme) || 'light') as ColorScheme;
  const q = useSearchParams()?.get('q') ?? '';

  const rfkId = process.env.NEXT_PUBLIC_SEARCH_QUESTIONS_RFKID;
  const configured =
    !!process.env.NEXT_PUBLIC_SEARCH_ENV &&
    !!process.env.NEXT_PUBLIC_SEARCH_CUSTOMER_KEY &&
    !!process.env.NEXT_PUBLIC_SEARCH_API_KEY;

  // `keyphrase` has a minimum length of 1 — an empty query is an API error, not
  // a "browse all" request, so there is nothing to render until someone asks.
  if (!configured || !rfkId || !q.trim() || SEARCH_LANGUAGE !== 'en') return null;

  return (
    <section className={cn(searchQuestionsVariants({ colorScheme }), params?.styles)}>
      <div className="mx-auto w-full max-w-screen-xl px-4 xl:px-8">
        <SearchQuestionsWidget key={q} rfkId={rfkId} defaultKeyphrase={q} />
      </div>
    </section>
  );
};

export const Default = (props: ComponentProps) => (
  <Suspense fallback={null}>
    <SearchQuestionsContent {...props} />
  </Suspense>
);
