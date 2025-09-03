'use server';
/**
 * @fileOverview A flow to format roleplay script text with specific styling.
 *
 * - formatRoleplayScript - A function that formats roleplay script text.
 * - FormatRoleplayScriptInput - The input type for the formatRoleplayScript function.
 * - FormatRoleplayScriptOutput - The return type for the formatRoleplayScript function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FormatRoleplayScriptInputSchema = z.object({
  text: z.string().describe('The roleplay script text to format.'),
});
export type FormatRoleplayScriptInput = z.infer<typeof FormatRoleplayScriptInputSchema>;

const FormatRoleplayScriptOutputSchema = z.object({
  formattedText: z
    .string()
    .describe(
      'The roleplay script text formatted with white text for Narration/Action and grey italic text for Dialogue/Inner tone.'
    ),
});
export type FormatRoleplayScriptOutput = z.infer<typeof FormatRoleplayScriptOutputSchema>;

export async function formatRoleplayScript(input: FormatRoleplayScriptInput): Promise<FormatRoleplayScriptOutput> {
  return formatRoleplayScriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'formatRoleplayScriptPrompt',
  input: {schema: FormatRoleplayScriptInputSchema},
  output: {schema: FormatRoleplayScriptOutputSchema},
  prompt: `You are an expert in formatting roleplay scripts. Your task is to format the given text, which might contain narration, action, dialogue, and inner thoughts. 

Narration and action should be clearly identified.
Dialogue and inner thoughts should be formatted in a distinct style from narration and action.

Input Text: {{{text}}}

Output:
Format the input text with white text for Narration/Action and grey italic text for Dialogue/Inner tone. Return the formatted text. If it is not possible to format the text, return it as is.
`,
});

const formatRoleplayScriptFlow = ai.defineFlow(
  {
    name: 'formatRoleplayScriptFlow',
    inputSchema: FormatRoleplayScriptInputSchema,
    outputSchema: FormatRoleplayScriptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
