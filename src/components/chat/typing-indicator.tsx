
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Character } from '@/lib/characters';

export function TypingIndicator({ character }: { character: Character }) {
  return (
    <div className="flex items-center gap-3 justify-start">
      <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
        <AvatarImage src={character.avatarUrl || `https://picsum.photos/seed/${encodeURIComponent(character.name)}/400/400`} alt={character.name} />
        <AvatarFallback>{character.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex items-center gap-1.5 bg-card text-card-foreground rounded-lg px-4 py-3 shadow-sm">
        <span className="h-2 w-2 animate-pulse-fast rounded-full bg-muted-foreground" />
        <span className="h-2 w-2 animate-pulse-medium rounded-full bg-muted-foreground" />
        <span className="h-2 w-2 animate-pulse-slow rounded-full bg-muted-foreground" />
      </div>
    </div>
  );
}
