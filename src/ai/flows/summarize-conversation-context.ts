// Summarizes the conversation context to maintain consistent AI persona.

'use server';

/**
 * @fileOverview Summarizes conversation context for consistent AI persona.
 *
 * - summarizeConversationContext - A function that summarizes the conversation context.
 * - SummarizeConversationContextInput - The input type for the summarizeConversationContext function.
 * - SummarizeConversationContextOutput - The return type for the summarizeConversationContext function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeConversationContextInputSchema = z.object({
  conversationHistory: z
    .string()
    .describe('The complete history of the conversation.'),
  characterDescription: z.string().describe('Description of the character.'),
});
export type SummarizeConversationContextInput = z.infer<
  typeof SummarizeConversationContextInputSchema
>;

const SummarizeConversationContextOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the conversation.'),
});
export type SummarizeConversationContextOutput = z.infer<
  typeof SummarizeConversationContextOutputSchema
>;

export async function summarizeConversationContext(
  input: SummarizeConversationContextInput
): Promise<SummarizeConversationContextOutput> {
  return summarizeConversationContextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeConversationContextPrompt',
  input: {
    schema: SummarizeConversationContextInputSchema,
  },
  output: {
    schema: SummarizeConversationContextOutputSchema,
  },
  prompt: `You are an AI assistant designed to summarize conversations between a user and an AI character.

  Given the conversation history and the character description, create a concise summary of the conversation that captures the key details and maintains the character's persona.

  Character Description: {{{characterDescription}}}

  Conversation History: {{{conversationHistory}}}

  Summary:`,
});

const summarizeConversationContextFlow = ai.defineFlow(
  {
    name: 'summarizeConversationContextFlow',
    inputSchema: SummarizeConversationContextInputSchema,
    outputSchema: SummarizeConversationContextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
