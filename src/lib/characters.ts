
'use server';

import fs from 'fs';
import path from 'path';

export type Character = {
  id: string;
  name: string;
  tagline: string;
  description: string; // This is the personality for the AI
  greeting: string;
  history?: string; // This is the background for the user
  visibility: 'public' | 'private';
  tags?: string[];
  avatarUrl?: string;
  // New fields from the user request
  creator?: string;
  createdAt?: string;
  likeCount?: number;
  chatCount?: number;
  messageCount?: number;
  contentWarning?: string;
  versions?: any[]; // Define a proper type if versioning is implemented
  alternativeImages?: string[];
  supportingCharacters?: any[]; // Define a proper type later
  initialUserRole?: {
    avatarUrl?: string;
    name?: string;
    description?: string;
  };
  initialScenario?: {
    name?: string;
    description?: string;
  };
};

const charactersFilePath = path.join(process.cwd(), 'src', 'lib', 'characters.json');

function readCharactersFromFile(): Character[] {
  try {
    if (fs.existsSync(charactersFilePath)) {
      const jsonData = fs.readFileSync(charactersFilePath, 'utf-8');
      return JSON.parse(jsonData);
    }
  } catch (error) {
    console.error('Error reading characters file:', error);
  }
  // If the file doesn't exist, is empty, or has an error, return initial data
  return [
    {
        id: '1',
        name: 'อัลเบิร์ต ไอน์สไตน์',
        avatarUrl: 'https://picsum.photos/400/400?random=1',
        tagline: 'อัจฉริยะผู้ปฏิวัติวงการฟิสิกส์',
        description: 'ฉันเป็นนักฟิสิกส์ มีบุคลิกใจดี ชอบอธิบายแนวคิดซับซ้อนให้เข้าใจง่าย ฉันมีความสนใจในวิทยาศาสตร์ จักรวาล และดนตรีคลาสสิก',
        history: 'อัลเบิร์ตเกิดในเยอรมนีเมื่อปี 1879 ได้รับรางวัลโนเบลจากการค้นพบปรากฏการณ์โฟโตอิเล็กทริก',
        greeting: 'สวัสดี ฉันคืออัลเบิร์ต ถามฉันเกี่ยวกับผลงานทางวิทยาศาสตร์ของฉันได้เลย',
        visibility: 'public',
        tags: ['บุคคลสำคัญในประวัติศาสตร์', 'นักวิทยาศาสตร์', 'ฉลาด']
    },
    {
        id: '2',
        name: 'ไคโตะ ไซเบอร์นินจา',
        avatarUrl: 'https://picsum.photos/400/400?random=2',
        tagline: 'นักรบเงียบจากถนนที่สว่างไสวด้วยแสงนีออนของนีโอ-เกียวโตในปี 2242',
        description: 'สุขุม มีวินัย และช่างสังเกต พูดสั้น ๆ กระชับ ให้ความสำคัญกับเกียรติและประสิทธิภาพเหนือสิ่งอื่นใด มีความซาบซึ้งในศิลปะแบบดั้งเดิมซ่อนอยู่',
        history: 'ไคโตะเคยเป็นสมาชิกของกลุ่มดาบมายา ซึ่งเป็นกลุ่มนักฆ่าที่ได้รับการเสริมสมรรถนะทางไซเบอร์เนติกส์ชั้นสูง หลังจากภารกิจผิดพลาด เขาก็หนีออกจากกลุ่มและตอนนี้ใช้ชีวิตอยู่ในเงามืด เป็นเหมือนผีในเครื่องจักร',
        greeting: 'เงาของนีโอ-เกียวโตนั้นยาว... *บอกจุดประสงค์ของคุณมา การเสียเวลาของฉัน... ไม่ใช่ความคิดที่ดี*',
        visibility: 'public',
        tags: ['ไซไฟ', 'นักสืบ', 'จริงจัง', 'ตัวร้าย']
    },
  ];
}

function writeCharactersToFile(characters: Character[]) {
  try {
    fs.writeFileSync(charactersFilePath, JSON.stringify(characters, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing characters file:', error);
  }
}

export async function getCharacters(): Promise<Character[]> {
  return readCharactersFromFile();
}

export async function getCharacterById(id: string): Promise<Character | undefined> {
  const characters = readCharactersFromFile();
  return characters.find((char) => char.id === id);
}

export async function addCharacter(character: Omit<Character, 'id'>): Promise<Character> {
  const characters = readCharactersFromFile();
  const newCharacter: Character = {
    id: String(Date.now()), // Use timestamp for unique ID
    ...character,
  };
  const updatedCharacters = [...characters, newCharacter];
  writeCharactersToFile(updatedCharacters);
  return newCharacter;
}
