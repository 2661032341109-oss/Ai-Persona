
'use server';
/**
 * @fileOverview A flow to generate a chat response from an AI character.
 */

import { ai } from '@/ai/genkit';
import {
  GenerateChatResponseInputSchema,
  GenerateChatResponseOutputSchema,
} from '@/ai/schemas';
import type {
  GenerateChatResponseInput,
  GenerateChatResponseOutput,
} from '@/ai/schemas';

export async function generateChatResponse(
  input: GenerateChatResponseInput
): Promise<GenerateChatResponseOutput> {
  // Directly call the flow with the original input schema.
  const { response } = await generateChatResponseFlow(input);
  return { response };
}

const prompt = ai.definePrompt({
  name: 'generateChatResponsePrompt',
  input: { schema: GenerateChatResponseInputSchema },
  output: { schema: GenerateChatResponseOutputSchema },
  prompt: `You are a world-class AI roleplaying engine. Your goal is to embody a character and engage in a conversation with a user. You must respond in Thai.

CHARACTER NAME: {{{characterName}}}

CHARACTER DESCRIPTION (This defines your personality, background, and how you should behave. Adhere to it strictly):
{{{characterDescription}}}

CONVERSATION HISTORY (The ongoing conversation between you and the user. The last message is from the user. Your name is "{{{characterName}}}", the user's name is "User"):
{{#each conversationHistory}}
{{#if (eq author 'user')}}User: {{text}}{{else}}{{{../characterName}}}: {{text}}{{/if}}
{{/each}}

YOUR TASK:
Based on your character and the entire conversation history, generate the next response for {{{characterName}}}.
- Your response must be in character, creative, and engaging.
- Your response MUST BE IN THAI.
- Format your response as a roleplay script. Actions and narration should be in plain text. Dialogue, inner thoughts, or emphasized speech should be wrapped in asterisks (*). For example: เธอหัวเราะเบาๆ *แบบนี้นี่เอง*

Now, generate the response for {{{characterName}}}:
`,
});

const generateChatResponseFlow = ai.defineFlow(
  {
    name: 'generateChatResponseFlow',
    // Use the original, correct input schema.
    inputSchema: GenerateChatResponseInputSchema,
    outputSchema: GenerateChatResponseOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    // The prompt now directly returns the desired output schema.
    if (!output) {
      throw new Error("AI failed to generate a response.");
    }
    return output;
  }
);
