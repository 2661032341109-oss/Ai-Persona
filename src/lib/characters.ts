'use server';

import { db } from '@/lib/firebase';
import {
  collection,
  query,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  limit,
  writeBatch,
} from 'firebase/firestore';
import { getConversation, deleteConversation, getLastMessage } from './conversations';
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
  creator?: string;
  createdAt: string; // ISO 8601 date string
  likeCount?: number;
  chatCount?: number;
  messageCount?: number;
};

const charactersCollection = collection(db, 'characters');

async function revalidateAllPaths() {
    revalidatePath('/');
    revalidatePath('/character/create');
    revalidatePath('/character/edit/[characterId]');
    revalidatePath('/chat/[characterId]');
}


export async function getCharacters(): Promise<Character[]> {
  const q = query(charactersCollection, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  const characters = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Character[];
  return characters;
}

export async function getCharacterById(id: string): Promise<Character | null> {
  const characterDoc = doc(db, 'characters', id);
  const docSnap = await getDoc(characterDoc);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Character;
  } else {
    console.warn(`Character with id ${id} not found.`);
    return null;
  }
}

export async function addCharacter(characterData: Omit<Character, 'id' | 'createdAt'>): Promise<Character> {
  const newCharacterData = {
    ...characterData,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    chatCount: 0,
    messageCount: 0,
  };
  const docRef = await addDoc(charactersCollection, newCharacterData);
  await revalidateAllPaths();
  return { id: docRef.id, ...newCharacterData };
}

export async function updateCharacter(id:string, characterData: Partial<Omit<Character, 'id' | 'createdAt'>>): Promise<Character | null> {
    const characterDoc = doc(db, 'characters', id);
    const docSnap = await getDoc(characterDoc);

    if (!docSnap.exists()) {
        console.error(`Cannot update: Character with id ${id} not found.`);
        return null;
    }
    
    await updateDoc(characterDoc, characterData);
    await revalidateAllPaths();

    const updatedDocSnap = await getDoc(characterDoc);
    return { id: updatedDocSnap.id, ...updatedDocSnap.data() } as Character;
}

export async function deleteCharacter(id: string): Promise<void> {
    const characterDoc = doc(db, 'characters', id);
    await deleteDoc(characterDoc);
    // Also delete associated conversation subcollection
    await deleteConversation(id); 
    await revalidateAllPaths();
    console.log(`Character ${id} and their conversation have been deleted.`);
}

export async function getCharactersWithLastMessage(): Promise<(Character & { lastMessage?: string })[]> {
    const characters = await getCharacters();
    const charactersWithLastMessage = await Promise.all(
        characters.map(async (character) => {
            const lastMessage = await getLastMessage(character.id);
            return {
                ...character,
                lastMessage: lastMessage?.text,
            };
        })
    );
    return charactersWithLastMessage;
}
