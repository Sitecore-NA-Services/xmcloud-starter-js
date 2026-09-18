import { createAzure } from '@ai-sdk/azure';
import { wrapLanguageModel, type LanguageModelV1Middleware } from 'ai';

/**
 * Azure OpenAI provider for the chat API routes.
 * Requires AZURE_OPENAI_RESOURCE_NAME, AZURE_OPENAI_API_KEY and
 * AZURE_OPENAI_DEPLOYMENT to be set (see .env.local).
 */
const azure = createAzure({
  resourceName: process.env.AZURE_OPENAI_RESOURCE_NAME,
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  apiVersion: process.env.AZURE_OPENAI_API_VERSION || '2024-10-21',
});

const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-5.6-luna';

/**
 * Reasoning models (gpt-5.x, o-series) reject `temperature`, `top_p`,
 * `frequency_penalty`, `presence_penalty` and `max_tokens` outright — they want
 * `max_completion_tokens` instead. @ai-sdk/openai already rewrites those, but it
 * decides whether to by string-matching the *model id*, and on Azure the model id
 * is whatever the deployment happens to be named. Rename the deployment to
 * something that doesn't start with "gpt-5" or "o" and every chat request starts
 * returning 400. Don't make the deployment name load-bearing: normalise here.
 *
 * Set AZURE_OPENAI_REASONING_MODEL explicitly to override the guess.
 */
function isReasoningDeployment(name: string): boolean {
  const flag = process.env.AZURE_OPENAI_REASONING_MODEL;
  if (flag !== undefined && flag !== '') return flag.toLowerCase() === 'true';
  return /^(gpt-5|o[1-9])/i.test(name);
}

const reasoningParamsMiddleware: LanguageModelV1Middleware = {
  middlewareVersion: 'v1',
  transformParams: async ({ params }) => {
    const { maxTokens, providerMetadata } = params;

    return {
      ...params,
      temperature: undefined,
      topP: undefined,
      frequencyPenalty: undefined,
      presencePenalty: undefined,
      maxTokens: undefined,
      // max_tokens -> max_completion_tokens, unless the caller already set it.
      providerMetadata:
        maxTokens == null
          ? providerMetadata
          : {
              ...providerMetadata,
              openai: { maxCompletionTokens: maxTokens, ...providerMetadata?.openai },
            },
    };
  },
};

// `structuredOutputs` defaults to ON for anything the SDK reads as a reasoning
// model, which sends every tool with `strict: true`. Strict schemas must list
// every property in `required`, so a tool with `.optional()` params (see
// searchArticles in /api/chat/agent) is rejected outright with "'required' is
// required to be supplied and to be an array including every key in properties".
// Keep it off so optional tool params stay legal.
const baseChatModel = azure(deploymentName, { structuredOutputs: false });

export const chatModel = isReasoningDeployment(deploymentName)
  ? wrapLanguageModel({ model: baseChatModel, middleware: reasoningParamsMiddleware })
  : baseChatModel;

/** Used to rerank Sitecore Search results by embedding cosine similarity (see src/lib/rerank.ts). */
export const embeddingModel = azure.textEmbeddingModel(
  process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT || 'text-embedding-3-small',
);
