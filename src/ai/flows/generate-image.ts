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

const prompt = ai.definePrompt({
    name: 'generateImagePrompt',
    input: { schema: GenerateImageInputSchema },
    prompt: `Generate a high-quality, anime-style portrait of a character based on the following description. The image should be suitable for a character profile.

Description: {{{prompt}}}
`,
});


const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
        model: 'googleai/gemini-1.5-flash-latest',
        prompt: await prompt.renderText({input}),
    });

    if (!media || !media.url) {
        throw new Error('Image generation failed to return a valid image.');
    }
    
    return { imageUrl: media.url };
  }
);
