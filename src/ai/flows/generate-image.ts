'use server';
/**
 * @fileOverview A flow to generate an image from a text prompt.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const GenerateImageInputSchema = z.object({
  prompt: z.string().describe('A text prompt to generate an image from.'),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

export const GenerateImageOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.'),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

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
    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `Generate a high-quality anime-style portrait based on the following description: ${input.prompt}. The image should be vibrant, detailed, and suitable for a character profile picture.`,
    });
    
    if (!media.url) {
      throw new Error('Image generation failed to return a URL.');
    }

    return { imageUrl: media.url };
  }
);
