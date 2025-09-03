
'use client';

import Image from 'next/image';
import { User } from 'lucide-react';
import type { Message } from '@/app/chat/[characterId]/page';
import type { Character } from '@/lib/characters';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FormattedMessage } from './formatted-message';

interface ChatMessageProps {
  message: Message;
  character: Character;
}

export function ChatMessage({ message, character }: ChatMessageProps) {
  const isUser = message.author === 'user';

  return (
    <div
      className={cn(
        'flex items-start gap-4',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <Avatar className="h-10 w-10 border-2 border-background shadow-lg transition-transform hover:scale-110">
          <AvatarImage src={character.avatarUrl || `https://picsum.photos/seed/${encodeURIComponent(character.name)}/400/400`} alt={character.name} />
          <AvatarFallback>{character.name.charAt(0)}</AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-xl rounded-2xl px-5 py-3 text-base shadow-md transition-all',
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-none'
            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none'
        )}
      >
        {isUser ? (
          <p className='whitespace-pre-wrap'>{message.text}</p>
        ) : (
          <FormattedMessage text={message.text} />
        )}
      </div>
      {isUser && (
        <Avatar className="h-10 w-10 border-2 border-background shadow-lg">
           <AvatarFallback className="bg-slate-200 text-slate-600">
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
