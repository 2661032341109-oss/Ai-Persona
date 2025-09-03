
'use server';

import { db } from '@/lib/firebase';
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  addDoc,
  serverTimestamp,
  writeBatch,
  Timestamp,
  doc,
} from 'firebase/firestore';
import type { Message as ChatMessage } from '@/app/chat/[characterId]/page';
import { revalidatePath } from 'next/cache';

// Re-exporting the type with a more specific name for Firestore usage
export type FirestoreMessage = Omit<ChatMessage, 'id'> & {
  createdAt: Timestamp;
};

// This function now specifically gets the last message for the preview on the main page.
export async function getLastMessage(characterId: string): Promise<ChatMessage | null> {
  const messagesCollection = collection(db, 'characters', characterId, 'messages');
  // We query for the last 1 message to show on the card.
  const q = query(messagesCollection, orderBy('createdAt', 'desc'), limit(1));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return null;
  }
  
  const lastDoc = querySnapshot.docs[0];
  const data = lastDoc.data();

  return {
    id: lastDoc.id,
    author: data.author,
    text: data.text,
  };
}

export async function getConversation(characterId: string): Promise<ChatMessage[]> {
  const messagesCollection = collection(db, 'characters', characterId, 'messages');
  const q = query(messagesCollection, orderBy('createdAt', 'asc'));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return [];
  }

  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      author: data.author,
      text: data.text,
    };
  });
}


export async function saveConversation(characterId: string, messages: ChatMessage[]): Promise<void> {
    const batch = writeBatch(db);
    const messagesCollectionRef = collection(db, 'characters', characterId, 'messages');

    messages.forEach((message) => {
        // Use the message's unique ID for the document ID in Firestore
        const docRef = doc(messagesCollectionRef, message.id);
        const { id, ...messageData } = message;
        batch.set(docRef, {
            ...messageData,
            createdAt: serverTimestamp() // Use server timestamp for consistent ordering
        });
    });

    try {
        await batch.commit();
        revalidatePath('/'); // Revalidate home page to show last message updates
        revalidatePath(`/chat/${characterId}`);
    } catch (error) {
        console.error("Error saving conversation with batch: ", error);
    }
}


export async function addMessage(characterId: string, message: Omit<ChatMessage, 'id'>): Promise<string> {
    const messagesCollectionRef = collection(db, 'characters', characterId, 'messages');
    const docRef = await addDoc(messagesCollectionRef, {
        ...message,
        createdAt: serverTimestamp(),
    });
    revalidatePath('/');
    revalidatePath(`/chat/${characterId}`);
    return docRef.id;
}


// This function will delete an entire collection in Firestore.
// It's a bit more complex because we have to delete documents in batches.
export async function deleteConversation(characterId: string): Promise<void> {
  const messagesCollectionRef = collection(db, 'characters', characterId, 'messages');
  const querySnapshot = await getDocs(messagesCollectionRef);

  if (querySnapshot.empty) {
    return; // Nothing to delete
  }

  // Firestore allows a maximum of 500 operations in a single batch.
  const batches = [];
  let currentBatch = writeBatch(db);
  let operationCount = 0;

  querySnapshot.docs.forEach((doc, index) => {
    currentBatch.delete(doc.ref);
    operationCount++;
    // If the batch is full, push it to the array and start a new one.
    if (operationCount === 500) {
      batches.push(currentBatch);
      currentBatch = writeBatch(db);
      operationCount = 0;
    }
  });

  // Add the last batch if it has any operations.
  if (operationCount > 0) {
    batches.push(currentBatch);
  }

  // Commit all batches.
  try {
    await Promise.all(batches.map(batch => batch.commit()));
    console.log(`Conversation for character ${characterId} has been deleted.`);
  } catch(error) {
    console.error("Error deleting conversation in batches:", error);
  }
}
