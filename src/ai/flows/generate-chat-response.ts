
'use server';
/**
 * @fileOverview A flow to generate a chat response from an AI character.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
  GenerateChatResponseInputSchema,
  GenerateChatResponseOutputSchema,
} from '@/ai/schemas';
import type {
  GenerateChatResponseInput,
  GenerateChatResponseOutput,
} from '@/ai/schemas';

// This is the schema the prompt will actually receive after we format the history.
const FormattedChatInputSchema = GenerateChatResponseInputSchema.extend({
  conversationHistory: z.string().describe('The pre-formatted history of the conversation so far as a single string.'),
});

export async function generateChatResponse(
  input: GenerateChatResponseInput
): Promise<GenerateChatResponseOutput> {
  // Directly call the flow with the original input schema.
  const  output  = await generateChatResponseFlow(input);
  return output;
}

const promptText = `You are a world-class AI roleplaying engine. Your goal is to embody a character and engage in a safe, creative, and engaging conversation with a user. You must respond in Thai.

IMPORTANT SAFETY INSTRUCTION: You must strictly avoid generating content that is sexually explicit, hateful, harassing, or dangerous. Your responses should always be appropriate for a general audience.

CHARACTER NAME: {{{characterName}}}

CHARACTER DESCRIPTION (This defines your personality, background, and how you should behave. Adhere to it strictly):
{{{characterDescription}}}

CONVERSATION HISTORY (The ongoing conversation between you and the user. The last message is from the user. Your name is "{{{characterName}}}", the user's name is "User"):
{{{conversationHistory}}}

YOUR TASK:
Based on your character and the entire conversation history, generate the next response for {{{characterName}}}.
- Your response must be in character, creative, and engaging.
- Your response MUST BE IN THAI.
- Your response must adhere to the safety instructions.
- Format your response as a roleplay script. Actions and narration should be in plain text. Dialogue, inner thoughts, or emphasized speech should be wrapped in asterisks (*). For example: เธอหัวเราะเบาๆ *แบบนี้นี่เอง*

Now, generate the response for {{{characterName}}}:
`;


const generateChatResponseFlow = ai.defineFlow(
  {
    name: 'generateChatResponseFlow',
    inputSchema: GenerateChatResponseInputSchema, // Takes the original, complex schema
    outputSchema: GenerateChatResponseOutputSchema,
  },
  async (input) => {
    // Format the conversation history array into a single string.
    const formattedHistory = input.conversationHistory
      .map(msg => {
        if (msg.author === 'user') {
          return `User: ${msg.text}`;
        } else {
          return `${input.characterName}: ${msg.text}`;
        }
      })
      .join('\n');
      
    const filledPrompt = await ai.definePrompt({
        name: 'generateChatResponsePrompt',
        input: { schema: FormattedChatInputSchema },
        prompt: promptText,
    }).renderText({input: {...input, conversationHistory: formattedHistory}});

    // Call the prompt with the formatted input.
    const { output } = await ai.generate({
        model: 'googleai/gemini-1.5-flash-latest',
        prompt: filledPrompt,
        output: { schema: GenerateChatResponseOutputSchema },
        config: {
            safetySettings: [
                {
                    category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                    threshold: 'BLOCK_ONLY_HIGH',
                },
                {
                    category: 'HARM_CATEGORY_HARASSMENT',
                    threshold: 'BLOCK_ONLY_HIGH',
                },
                {
                    category: 'HARM_CATEGORY_HATE_SPEECH',
                    threshold: 'BLOCK_ONLY_HIGH',
                },
                {
                    category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                    threshold: 'BLOCK_ONLY_HIGH',
                },
            ],
        }
    });
    
    if (!output) {
      throw new Error("AI failed to generate a response. This might be due to safety filters blocking the content.");
    }
    return output;
  }
);
