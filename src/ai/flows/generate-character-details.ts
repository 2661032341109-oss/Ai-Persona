'use server';
/**
 * @fileOverview A flow to generate character details based on a prompt.
 */

import { ai } from '@/ai/genkit';
import { GenerateCharacterDetailsInputSchema, GenerateCharacterDetailsOutputSchema } from '@/ai/schemas';
import type { GenerateCharacterDetailsInput, GenerateCharacterDetailsOutput } from '@/ai/schemas';

const generateCharacterPrompt = ai.definePrompt({
  name: 'generateCharacterPrompt',
  input: { schema: GenerateCharacterDetailsInputSchema },
  output: { schema: GenerateCharacterDetailsOutputSchema },
  prompt: `You are an expert character creator. Based on the following prompt, generate a detailed character. Fill in any missing details with creative and interesting information. Ensure all fields are populated.

Prompt: {{{prompt}}}
`,
});


export const generateCharacterDetailsFlow = ai.defineFlow(
  {
    name: 'generateCharacterDetailsFlow',
    inputSchema: GenerateCharacterDetailsInputSchema,
    outputSchema: GenerateCharacterDetailsOutputSchema,
  },
  async (input) => {
    const { output } = await generateCharacterPrompt(input);
    return output!;
  }
);

export async function generateCharacterDetails(
  input: GenerateCharacterDetailsInput
): Promise<GenerateCharacterDetailsOutput> {
  return generateCharacterDetailsFlow(input);
}
