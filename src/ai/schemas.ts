import { z } from 'genkit';

/**
 * @fileOverview Schemas for AI flows
 */

// Generate Character Details (Simple)
export const GenerateCharacterDetailsInputSchema = z.object({
  prompt: z.string().describe('A prompt describing the character to generate.'),
});
export type GenerateCharacterDetailsInput = z.infer<
  typeof GenerateCharacterDetailsInputSchema
>;

export const GenerateCharacterDetailsOutputSchema = z.object({
  name: z.string().describe("The character's name."),
  tagline: z
    .string()
    .describe("The character's tagline or a short introduction."),
  personality: z
    .string()
    .describe("A detailed description of the character's personality."),
  greeting: z.string().describe('A greeting message from the character.'),
});
export type GenerateCharacterDetailsOutput = z.infer<
  typeof GenerateCharacterDetailsOutputSchema
>;

// Generate Image
export const GenerateImageInputSchema = z.object({
  prompt: z.string().describe('A text prompt to generate an image from.'),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

export const GenerateImageOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.'),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;


// Generate Character from Draft
export const GenerateCharacterFromDraftInputSchema = z.object({
    draft: z.string().describe('A rough draft or summary of the character.'),
});
export type GenerateCharacterFromDraftInput = z.infer<typeof GenerateCharacterFromDraftInputSchema>;

export const GenerateCharacterFromDraftOutputSchema = z.object({
    name: z.string().describe("The character's name extracted or generated from the draft."),
    tagline: z.string().describe("The character's tagline extracted or generated from the draft."),
    personality: z.string().describe("The character's detailed personality description from the draft."),
    greeting: z.string().describe("A greeting message for the character, inspired by the draft."),
    tags: z.array(z.string()).describe("A list of 5-10 relevant tags based on the draft."),
});
export type GenerateCharacterFromDraftOutput = z.infer<typeof GenerateCharacterFromDraftOutputSchema>;
