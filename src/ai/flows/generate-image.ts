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
