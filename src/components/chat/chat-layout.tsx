import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import type { Character } from '@/lib/characters';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AspectRatio } from '../ui/aspect-ratio';

interface ChatLayoutProps {
  character: Character;
  children: React.ReactNode;
}

export function ChatLayout({ character, children }: ChatLayoutProps) {
  return (
    <div className="flex h-[calc(100vh-theme(height.14))]">
      <aside className="hidden md:flex w-80 lg:w-96 flex-col border-r">
        <div className="p-6">
           <Button variant="ghost" asChild className="-ml-4 mb-4">
            <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                All Characters
            </Link>
        </Button>
          <AspectRatio ratio={1/1} className="rounded-lg overflow-hidden mb-4">
            <Image
                src={character.avatarUrl}
                alt={`Avatar of ${character.name}`}
                fill
                className="object-cover"
                data-ai-hint="character portrait"
            />
          </AspectRatio>
          <h2 className="text-2xl font-bold font-headline">{character.name}</h2>
          <p className="text-sm text-muted-foreground mt-1">{character.description}</p>
        </div>
        <Separator />
        <div className="flex-1 overflow-y-auto p-6 text-sm space-y-4">
          <div>
            <h3 className="font-semibold text-foreground/80 mb-2">Personality</h3>
            <p className="text-muted-foreground">{character.personality}</p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground/80 mb-2">Background</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{character.background}</p>
          </div>
        </div>
      </aside>
      <div className="flex-1 flex flex-col bg-muted/20">
        {children}
      </div>
    </div>
  );
}
