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
  prompt: `คุณคือผู้เชี่ยวชาญการสร้างตัวละครสำหรับนิยายและการสวมบทบาท
สร้างตัวละครที่มีรายละเอียดน่าสนใจ สร้างสรรค์ และมีมิติ จากคำอธิบายภาพรวมที่ได้รับมาต่อไปนี้

ตรวจสอบให้แน่ใจว่าได้กรอกข้อมูลในฟิลด์ผลลัพธ์ทั้งหมดครบถ้วน (ชื่อ, คำโปรย, บุคลิก, คำทักทาย) และข้อมูลทั้งหมดต้องเป็นภาษาไทย

คำอธิบายภาพรวม:
{{{prompt}}}
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
