'use server';
/**
 * @fileOverview A flow to generate character details from a user-provided draft.
 */

import { ai } from '@/ai/genkit';
import { GenerateCharacterFromDraftInputSchema, GenerateCharacterFromDraftOutputSchema } from '@/ai/schemas';
import type { GenerateCharacterFromDraftInput, GenerateCharacterFromDraftOutput } from '@/ai/schemas';

export async function generateCharacterFromDraft(
  input: GenerateCharacterFromDraftInput
): Promise<GenerateCharacterFromDraftOutput> {
  return generateCharacterFromDraftFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCharacterFromDraftPrompt',
  input: { schema: GenerateCharacterFromDraftInputSchema },
  output: { schema: GenerateCharacterFromDraftOutputSchema },
  prompt: `คุณคือผู้เชี่ยวชาญในการสร้างตัวละครจากบทสรุปที่ผู้ใช้ให้มา
วิเคราะห์ข้อความต่อไปนี้ และดึงข้อมูลเพื่อสร้างตัวละครที่มีรายละเอียดครบถ้วน
- ชื่อ (name): ชื่อของตัวละคร
- คำโปรย (tagline): ประโยคสั้นๆ ที่น่าดึงดูดและสรุปความเป็นตัวละคร
- บุคลิก (personality): คำอธิบายอย่างละเอียดเกี่ยวกับนิสัยของตัวละคร (Description Field)
- คำทักทาย (greeting): ประโยคทักทายแรกที่ตัวละครจะพูดกับผู้ใช้
- แท็ก (tags): สร้างแท็กที่เกี่ยวข้องกับตัวละคร 5-10 แท็ก จากข้อมูลทั้งหมด โดยเลือกจากหมวดหมู่ที่มีให้และต้องเป็นภาษาไทยเท่านั้น

บทสรุปร่าง:
{{{draft}}}

กรุณาสร้างข้อมูลทั้งหมดเป็นภาษาไทย

ข้อมูลหมวดหมู่แท็กสำหรับอ้างอิง:
- ระดับเนื้อหา: PG, NC, ธงแดง, ธงเขียว, ธงเหลือง, ธงขาว
- ประเภทสื่อ: อนิเมะ, มังงะ, วิดีโอเกม, ภาพยนตร์, ซีรีส์, การ์ตูนตะวันตก, ตัวละครมีม, ออริจินอล
- บทบาท: นักแสดง, นักร้อง, ไอดอล, นักกีฬา, นักธุรกิจ, นักการเมือง, บุคคลสำคัญในประวัติศาสตร์, ยูทูบเบอร์, สตรีมเมอร์, วีทูบเบอร์, อินฟลูเอนเซอร์เสมือน, มาเฟีย, ระบบ, วิศวะ, พ่อหมอ, หมอ, ครู, ศิลปิน, เชฟ, นักบิน, ช่างภาพ, นักดนตรี, โปรแกรมเมอร์, บอดี้การ์ด, หุ่นยนต์, นักวิทยาศาสตร์, นักสืบ, ตำรวจ, อัศวิน, นักบวช, แม่ชี, พ่อบ้าน, เทพเจ้า, คนไข้, พยาบาล, นักบุญ, ตัวร้าย, ฮีโร่, ขุนนาง, นักศึกษา, จักรพรรดิ, พระมเหสี, พระสนม, รัชทายาท
- บุคลิกและลักษณะนิสัย: โรแมนติก, อ่อนโยน, ตลก, สยองขวัญ, ระทึกขวัญ, ดราม่า, ลึกลับ, ซึนเดเระ, คูเดเระ, ฉลาด, ขี้อาย, จริงจัง, ร่าเริง, ซุ่มซ่าม, แฟนออกสาว, หมาโกลเด้น, แมวดำ, อีนิกม่า, อัลฟ่า, เบต้า, โอเมก้า, เนิร์ด, หมาเด็ก, หมาแก่, ซามอยด์, เจ้าเล่ห์
- ประเภท/องค์ประกอบเรื่อง: ไทยโบราณ, ผจญภัย, แฟนตาซี, แอคชัน, ชีวิตประจำวัน, ยุคกลาง, ข้ามมิติ, เกิดใหม่, ไซไฟ, หลังวันสิ้นโลก, จีนย้อนยุค
- เพศและความสัมพันธ์: แฟน, แต่งงาน, ยาโอย, ยูริ, ชายหญิง, ชาย, หญิง, ไบเซ็กชวล, ฟูตะ, เฟมบอย, แฟนเก่า, คนที่ชอบ, เคะ, เมะ
- ความสัมพันธ์: เพื่อน, เพื่อนร่วมห้อง, เพื่อนสนิท, น้องสาว, พี่ชาย, แม่, พ่อ, ลูกสาว, ลูกชาย
- ช่วงอายุ: วัยรุ่น, ผู้ใหญ่
- สิ่งมีชีวิตเหนือธรรมชาติ: ปีศาจ, เทวดา, วิญญาณ, ซาตาน, แม่มด, พ่อมด, เอลฟ์, แวมไพร์, มนุษย์หมาป่า, ซอมบี้, เอเลี่ยน, ยมทูต, กลายพันธุ์, มนุษย์สัตว์, เงือก, โทรล, ยักษ์, ก็อบลิน
- อื่นๆ: อื่นๆ
`,
});

const generateCharacterFromDraftFlow = ai.defineFlow(
  {
    name: 'generateCharacterFromDraftFlow',
    inputSchema: GenerateCharacterFromDraftInputSchema,
    outputSchema: GenerateCharacterFromDraftOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
