import { embedMany, cosineSimilarity } from 'ai';
import { embeddingModel } from '@/lib/azure-openai';
import type { SearchDoc } from '@/lib/sitecore-search-query';

/**
 * Re-ranks Sitecore Search results by embedding cosine similarity against the
 * query, since Sitecore Search's public API returns relevance-ordered results
 * but does not expose a numeric relevance score. One batched embeddings call
 * covers the query plus every candidate document, regardless of result count.
 */
export async function rerankByRelevance(query: string, docs: SearchDoc[]): Promise<SearchDoc[]> {
  if (!docs.length) return docs;

  const docTexts = docs.map((d) => `${d.title}. ${d.description ?? ''}`.trim());

  try {
    const { embeddings } = await embedMany({
      model: embeddingModel,
      values: [query, ...docTexts],
    });

    const [queryEmbedding, ...docEmbeddings] = embeddings;

    return docs
      .map((doc, i) => ({
        ...doc,
        relevanceScore: cosineSimilarity(queryEmbedding, docEmbeddings[i]),
      }))
      .sort((a, b) => (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0));
  } catch {
    // Embedding call failed (e.g. deployment not configured) — fall back to
    // Sitecore Search's own relevance ordering rather than breaking the chat.
    return docs;
  }
}

// Empirically, text-embedding-3-small scores relevant query/article pairs around
// 0.6-0.75 and unrelated pairs around 0.15-0.4 for this corpus - 0.75 filtered out
// every real match, so 0.45 sits in the gap between the two clusters.
const DEFAULT_THRESHOLD = Number(process.env.RAG_RELEVANCE_THRESHOLD) || 0.45;

/** Drops results below the configured relevance threshold (only applies once scored). */
export function filterByRelevance(docs: SearchDoc[], threshold = DEFAULT_THRESHOLD): SearchDoc[] {
  return docs.filter((d) => d.relevanceScore === undefined || d.relevanceScore >= threshold);
}
