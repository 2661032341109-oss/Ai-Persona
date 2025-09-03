import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CharacterCard } from '@/components/characters/character-card';
import { getCharacters } from '@/lib/characters';

export default function HomePage() {
  const characters = getCharacters();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-start md:items-center mb-8 gap-4 flex-col md:flex-row">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-headline text-foreground">
            Choose Your Companion
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Select a character to start a roleplay conversation, or bring your own imagination to life by creating a new one.
          </p>
        </div>
        <Button asChild className="shrink-0">
          <Link href="/character/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Character
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {characters.map((character) => (
          <CharacterCard key={character.id} character={character} />
        ))}
      </div>
    </div>
  );
}
