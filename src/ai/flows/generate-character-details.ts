'use server';
/**
 * @fileOverview A flow to generate character details based on a prompt.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const GenerateCharacterDetailsInputSchema = z.object({
  prompt: z.string().describe('A prompt describing the character to generate.'),
});
export type GenerateCharacterDetailsInput = z.infer<
  typeof GenerateCharacterDetailsInputSchema
>;

export const GenerateCharacterDetailsOutputSchema = z.object({
  name: z.string().describe("The character's name."),
  tagline: z.string().describe("The character's tagline or a short introduction."),
  personality: z.string().describe("A detailed description of the character's personality."),
  greeting: z.string().describe("A greeting message from the character."),
});
export type GenerateCharacterDetailsOutput = z.infer<
  typeof GenerateCharacterDetailsOutputSchema
>;

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
