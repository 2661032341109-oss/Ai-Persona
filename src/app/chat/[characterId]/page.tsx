
'use client';

import { useEffect, useState, useRef, useCallback }from 'react';
import { useRouter, useParams } from 'next/navigation';
import type { Character } from '@/lib/characters';
import { getCharacterById } from '@/lib/characters';
import { ChatLayout } from '@/components/chat/chat-layout';
import { ChatInput } from '@/components/chat/chat-input';
import { ChatMessage } from '@/components/chat/chat-message';
import { TypingIndicator } from '@/components/chat/typing-indicator';
import { generateChatResponse } from '@/ai/flows/generate-chat-response';
import { useToast } from '@/hooks/use-toast';
import { getConversation, addMessage } from '@/lib/conversations';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Loader2 } from 'lucide-react';


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

  const fetchChatHistory = useCallback(async (char: Character) => {
      const history = await getConversation(char.id);
      if (history.length > 0) {
          setMessages(history);
      } else {
          // If no history, create and add the greeting message to the DB
          const greetingMessage: Omit<Message, 'id'> = {
            author: 'ai',
            text: char.greeting,
          };
          const newId = await addMessage(char.id, greetingMessage);
          setMessages([{ ...greetingMessage, id: newId }]);
      }
  }, []);

  useEffect(() => {
    if (characterId) {
      const fetchCharacter = async () => {
        setIsCharacterLoading(true);
        try {
            const char = await getCharacterById(characterId);
            if (char) {
              setCharacter(char);
              await fetchChatHistory(char);
            } else {
              toast({
                variant: 'destructive',
                title: 'ไม่พบตัวละคร',
                description: 'ไม่พบตัวละครที่คุณต้องการแชทด้วย',
              });
              router.push('/');
            }
        } catch (error) {
            console.error("Failed to fetch character:", error);
            toast({
                variant: 'destructive',
                title: 'เกิดข้อผิดพลาด',
                description: 'ไม่สามารถโหลดข้อมูลตัวละครได้',
            });
            router.push('/');
        } finally {
            setIsCharacterLoading(false);
        }
      }
      fetchCharacter();
    }
  }, [characterId, router, toast, fetchChatHistory]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);


  const handleSendMessage = async () => {
    if (!input.trim() || isLoading || !character) return;

    const userMessageText = input;
    const tempUserMessage: Message = {
      id: `temp-user-${Date.now()}`,
      author: 'user',
      text: userMessageText,
    };
    
    // Optimistically update the UI
    setMessages(prev => [...prev, tempUserMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare the conversation history for the AI
      const conversationForAI = [...messages, tempUserMessage]
        .slice(-20) // Use the last 20 messages for context
        .map(({ author, text }) => ({ author, text })); // Don't send IDs to AI

      // Call the AI to get a response
      const result = await generateChatResponse({
        characterName: character.name,
        characterDescription: character.description,
        conversationHistory: conversationForAI,
      });

      if (!result.response) {
        throw new Error('AI did not return a response.');
      }
      
      // Save both the user's message and the AI's response to the database
      const userMessageId = await addMessage(character.id, { author: 'user', text: userMessageText });
      const aiMessageId = await addMessage(character.id, { author: 'ai', text: result.response });

      // Create the final messages with real IDs
      const finalUserMessage: Message = { id: userMessageId, author: 'user', text: userMessageText };
      const aiResponseMessage: Message = { id: aiMessageId, author: 'ai', text: result.response };

      // Update the UI by replacing the temporary message and adding the final AI message
      setMessages(prev => [
          ...prev.filter(msg => msg.id !== tempUserMessage.id),
          finalUserMessage,
          aiResponseMessage
      ]);

    } catch (error) {
      console.error('Error in message send/receive flow:', error);
      toast({
        variant: 'destructive',
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถส่งข้อความได้ โปรดลองอีกครั้ง',
      });
      // If an error occurs, remove the optimistic user message from the UI
      setMessages(prev => prev.filter(msg => msg.id !== tempUserMessage.id));
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isCharacterLoading || !character) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary"/>
                <h2 className="text-xl font-semibold">กำลังโหลดตัวละคร...</h2>
                <p className="text-muted-foreground">กรุณารอสักครู่</p>
            </div>
        </div>
      )
  }

  return (
    <SidebarProvider>
    <ChatLayout character={character}>
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-gradient-to-br from-pink-50 via-rose-50 to-amber-50 dark:from-slate-900 dark:via-purple-950 dark:to-slate-950">
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
    </SidebarProvider>
  );
}
