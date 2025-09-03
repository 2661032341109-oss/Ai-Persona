
'use server';

import fs from 'fs/promises';
import path from 'path';
import { getConversation, deleteConversation } from './conversations';
import { revalidatePath } from 'next/cache';

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

async function readCharactersFromFile(): Promise<Character[]> {
  try {
    // Check if the file exists. If not, return an empty array and don't create the file yet.
    await fs.access(charactersFilePath);
    const jsonData = await fs.readFile(charactersFilePath, 'utf-8');
    // If the file is empty or just whitespace, return an empty array.
    if (!jsonData.trim()) {
      return [];
    }
    return JSON.parse(jsonData);
  } catch (error: any) {
    // If the error is that the file doesn't exist, it's a valid state.
    if (error.code === 'ENOENT') {
      return [];
    }
    // For other errors, log them as they might be actual issues.
    console.error('Error reading characters file:', error);
    return [];
  }
}

async function writeCharactersToFile(characters: Character[]) {
  try {
    await fs.writeFile(charactersFilePath, JSON.stringify(characters, null, 2), 'utf-8');
    revalidatePath('/'); // Revalidate the home page to show new/updated characters
    revalidatePath('/character/edit/[characterId]');
    revalidatePath('/chat/[characterId]');

  } catch (error) {
    console.error('Error writing characters file:', error);
  }
}

export async function getCharacters(): Promise<Character[]> {
  const characters = await readCharactersFromFile();
  return characters;
}

export async function getCharacterById(id: string): Promise<Character | undefined> {
  const characters = await getCharacters();
  return characters.find((char) => char.id === id);
}

export async function addCharacter(character: Omit<Character, 'id' | 'createdAt'>): Promise<Character> {
  const characters = await readCharactersFromFile();
  const newCharacter: Character = {
    id: String(Date.now()), // Use timestamp for unique ID
    createdAt: new Date().toISOString(),
    ...character,
  };
  const updatedCharacters = [...characters, newCharacter];
  await writeCharactersToFile(updatedCharacters);
  return newCharacter;
}

export async function updateCharacter(id: string, updatedCharacterData: Omit<Character, 'id' | 'createdAt'>): Promise<Character | null> {
    const characters = await readCharactersFromFile();
    const characterIndex = characters.findIndex((char) => char.id === id);

    if (characterIndex === -1) {
        return null;
    }

    const originalCharacter = characters[characterIndex];
    const updatedCharacter: Character = {
        ...originalCharacter, // Retain original id, createdAt
        ...updatedCharacterData, // Apply new data
    };

    characters[characterIndex] = updatedCharacter;
    await writeCharactersToFile(characters);
    return updatedCharacter;
}


export async function deleteCharacter(id: string): Promise<void> {
    const characters = await readCharactersFromFile();
    const updatedCharacters = characters.filter((char) => char.id !== id);
    await writeCharactersToFile(updatedCharacters);
    await deleteConversation(id); // Also delete associated conversation
}

export async function getCharactersWithLastMessage(): Promise<(Character & { lastMessage?: string })[]> {
    const characters = await getCharacters();
    const charactersWithLastMessage = await Promise.all(
        characters.map(async (character) => {
            const conversation = await getConversation(character.id);
            const lastMessage = conversation.length > 1 ? conversation[conversation.length - 1] : null; // Get last real message, not greeting
            return {
                ...character,
                lastMessage: lastMessage?.text,
            };
        })
    );
    return charactersWithLastMessage;
}
