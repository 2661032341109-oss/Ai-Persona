
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
  // Pre-format the conversation history into a single string.
  const historyText = input.conversationHistory
    .map(msg => {
      return msg.author === 'user'
        ? `User: ${msg.text}`
        : `${input.characterName}: ${msg.text}`;
    })
    .join('\n');

  // Call the flow with the pre-formatted history.
  const { response } = await generateChatResponseFlow({
    characterName: input.characterName,
    characterDescription: input.characterDescription,
    // Pass the formatted string instead of the array object.
    conversationHistory: historyText,
  });

  return { response };
}

// Define a new schema for the simplified flow input.
const SimpleChatInputSchema = GenerateChatResponseInputSchema.extend({
  conversationHistory: z.string().describe("The pre-formatted history of the conversation as a single text block."),
});


const prompt = ai.definePrompt({
  name: 'generateChatResponsePrompt',
  input: { schema: SimpleChatInputSchema },
  output: { schema: GenerateChatResponseOutputSchema },
  prompt: `You are a world-class AI roleplaying engine. Your goal is to embody a character and engage in a conversation with a user. You must respond in Thai.

CHARACTER NAME: {{{characterName}}}

CHARACTER DESCRIPTION (This defines your personality, background, and how you should behave. Adhere to it strictly):
{{{characterDescription}}}

CONVERSATION HISTORY (The ongoing conversation between you and the user. The last message is from the user):
{{{conversationHistory}}}

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
    inputSchema: SimpleChatInputSchema,
    outputSchema: GenerateChatResponseOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    // The prompt now directly returns the desired output schema.
    return output!;
  }
);
