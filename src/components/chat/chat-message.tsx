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
        'flex items-start gap-3',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
          <AvatarImage src={character.avatarUrl} alt={character.name} />
          <AvatarFallback>{character.name.charAt(0)}</AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-md rounded-lg px-4 py-3 text-base shadow-sm',
          isUser
            ? 'bg-primary/90 text-primary-foreground'
            : 'bg-card text-card-foreground'
        )}
      >
        {isUser ? (
          <p className='whitespace-pre-wrap'>{message.text}</p>
        ) : (
          <FormattedMessage text={message.text} />
        )}
      </div>
      {isUser && (
        <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
          <AvatarFallback>
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
