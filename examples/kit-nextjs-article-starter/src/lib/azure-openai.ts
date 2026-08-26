import { createAzure } from '@ai-sdk/azure';

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

export const chatModel = azure(process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o-mini');
