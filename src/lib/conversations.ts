
'use server';

import fs from 'fs/promises';
import path from 'path';
import type { Message } from '@/app/chat/[characterId]/page';
import { revalidatePath } from 'next/cache';

type Conversations = Record<string, Message[]>;

const conversationsFilePath = path.join(process.cwd(), 'src', 'lib', 'conversations.json');

async function readConversationsFromFile(): Promise<Conversations> {
    try {
        await fs.access(conversationsFilePath);
        const jsonData = await fs.readFile(conversationsFilePath, 'utf-8');
        if (!jsonData.trim()) {
            return {};
        }
        return JSON.parse(jsonData);
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            return {};
        }
        console.error('Error reading conversations file:', error);
        return {};
    }
}

async function writeConversationsToFile(conversations: Conversations): Promise<void> {
    try {
        await fs.writeFile(conversationsFilePath, JSON.stringify(conversations, null, 2), 'utf-8');
        revalidatePath('/'); // Revalidate home page to show last message updates
        revalidatePath('/chat/[characterId]');
    } catch (error) {
        console.error('Error writing conversations file:', error);
    }
}

export async function getConversation(characterId: string): Promise<Message[]> {
    const conversations = await readConversationsFromFile();
    return conversations[characterId] || [];
}

export async function saveConversation(characterId: string, messages: Message[]): Promise<void> {
    const conversations = await readConversationsFromFile();
    conversations[characterId] = messages;
    await writeConversationsToFile(conversations);
}

export async function deleteConversation(characterId: string): Promise<void> {
    const conversations = await readConversationsFromFile();
    delete conversations[characterId];
    await writeConversationsToFile(conversations);
}
