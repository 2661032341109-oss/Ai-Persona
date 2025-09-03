import { z } from 'genkit';

/**
 * @fileOverview Schemas for AI flows
 */

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


export const GenerateImageInputSchema = z.object({
  prompt: z.string().describe('A text prompt to generate an image from.'),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

export const GenerateImageOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.'),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;
