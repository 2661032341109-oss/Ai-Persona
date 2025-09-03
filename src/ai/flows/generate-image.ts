'use server';
/**
 * @fileOverview A flow to generate an image from a text prompt.
 */
import { ai } from '@/ai/genkit';
import { GenerateImageInputSchema, GenerateImageOutputSchema } from '@/ai/schemas';
import type { GenerateImageInput, GenerateImageOutput } from '@/ai/schemas';


export async function generateImage(input: GenerateImageInput): Promise<GenerateImageOutput> {
  return generateImageFlow(input);
}

const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async (input) => {
    // START_MODIFICATION
    // This is a temporary solution to avoid billing errors with the Imagen API.
    // We will return a random image from picsum.photos instead.
    const imageUrl = `https://picsum.photos/seed/${encodeURIComponent(input.prompt)}/400/400`;
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
    return { imageUrl };
    // END_MODIFICATION
  }
);
