
'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import type { Character } from '@/lib/characters';
import { getCharacterById } from '@/lib/characters';
import { ChatLayout } from '@/components/chat/chat-layout';
import { ChatInput } from '@/components/chat/chat-input';
import { ChatMessage } from '@/components/chat/chat-message';
import { TypingIndicator } from '@/components/chat/typing-indicator';
import { Skeleton } from '@/components/ui/skeleton';

export type Message = {
  id: string;
  author: 'user' | 'ai';
  text: string;
};

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const characterId = params.characterId as string;
  
  const [character, setCharacter] = useState<Character | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCharacterLoading, setIsCharacterLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (characterId) {
      const fetchCharacter = async () => {
        const char = await getCharacterById(characterId);
        if (char) {
          setCharacter(char);
          setMessages([
            {
              id: 'greeting',
              author: 'ai',
              text: char.greeting,
            },
          ]);
        } else {
          router.push('/'); // ไม่พบตัวละคร
        }
        setIsCharacterLoading(false);
      }
      fetchCharacter();
    }
  }, [characterId, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);


  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      author: 'user',
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        author: 'ai',
        text: `เธอพิจารณาคำพูดของคุณอย่างรอบคอบ ดวงตาของเธอครุ่นคิด *งั้นคุณอยากจะพูดถึงเรื่อง "${input.toLowerCase()}" สินะ? นั่นเป็นหัวข้อที่น่าสนใจ บอกฉันเพิ่มเติมหน่อยสิว่าทำไมคุณถึงคิดเรื่องนี้อยู่* ฉันกำลังฟังอยู่`,
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500 + Math.random() * 1000);
  };
  
  if (isCharacterLoading || !character) {
      return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="space-y-4">
                <Skeleton className="h-12 w-48 rounded-full" />
                <Skeleton className="h-6 w-96" />
                <Skeleton className="h-6 w-80" />
            </div>
        </div>
      )
  }

  return (
    <ChatLayout character={character}>
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} character={character} />
        ))}
        {isLoading && <TypingIndicator character={character} />}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t">
        <ChatInput
          input={input}
          setInput={setInput}
          handleSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </ChatLayout>
  );
}
