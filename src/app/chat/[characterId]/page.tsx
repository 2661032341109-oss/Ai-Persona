
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
import { generateChatResponse } from '@/ai/flows/generate-chat-response';
import { useToast } from '@/hooks/use-toast';

export type Message = {
  id: string;
  author: 'user' | 'ai';
  text: string;
};

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const characterId = params.characterId as string;
  const { toast } = useToast();
  
  const [character, setCharacter] = useState<Character | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCharacterLoading, setIsCharacterLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (characterId) {
      const fetchCharacter = async () => {
        setIsCharacterLoading(true);
        const char = await getCharacterById(characterId);
        if (char) {
          setCharacter(char);
          // Start with only the character's greeting
          setMessages([
            {
              id: 'greeting-' + char.id,
              author: 'ai',
              text: char.greeting,
            },
          ]);
        } else {
          // Character not found, redirect to home
          router.push('/');
          toast({
            variant: 'destructive',
            title: 'ไม่พบตัวละคร',
            description: 'ไม่พบตัวละครที่คุณต้องการแชทด้วย',
          });
        }
        setIsCharacterLoading(false);
      }
      fetchCharacter();
    }
  }, [characterId, router, toast]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);


  const handleSendMessage = async () => {
    if (!input.trim() || isLoading || !character) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      author: 'user',
      text: input,
    };
    
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const result = await generateChatResponse({
        characterName: character.name,
        characterDescription: character.description,
        conversationHistory: newMessages.slice(-10).map(msg => ({ author: msg.author, text: msg.text })), // Send last 10 messages for context
      });

      if (result.response) {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          author: 'ai',
          text: result.response,
        };
        setMessages((prev) => [...prev, aiResponse]);
      } else {
        throw new Error('AI did not return a response.');
      }
    } catch (error) {
      console.error('Error generating chat response:', error);
      toast({
        variant: 'destructive',
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถสร้างคำตอบได้ โปรดลองอีกครั้งในภายหลัง',
      });
      // Optional: remove the user's message if the AI fails
      setMessages(messages);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isCharacterLoading || !character) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4 text-center">
                <TypingIndicator character={{ name: 'กำลังโหลด', avatarUrl: ''}} />
                <h2 className="text-xl font-semibold">กำลังโหลดตัวละคร...</h2>
                <p className="text-muted-foreground">กรุณารอสักครู่</p>
            </div>
        </div>
      )
  }

  return (
    <ChatLayout character={character}>
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-gradient-to-br from-pink-50 via-rose-50 to-amber-50">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} character={character} />
        ))}
        {isLoading && <TypingIndicator character={character} />}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t bg-white/80 backdrop-blur-sm">
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
