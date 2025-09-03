
import Link from 'next/link';
import Image from 'next/image';
import type { Character } from '@/lib/characters';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface CharacterCardProps {
  character: Character;
}

export function CharacterCard({ character }: CharacterCardProps) {
  return (
    <Link href={`/chat/${character.id}`} className="group block">
      <Card className="h-full overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-lg group-hover:-translate-y-1 group-hover:shadow-primary/20">
        <CardHeader>
          <CardTitle className="font-headline tracking-tight">{character.name}</CardTitle>
          <CardDescription className="line-clamp-2">{character.tagline}</CardDescription>
        </CardHeader>
        <CardContent>
          <AspectRatio ratio={1 / 1} className="bg-muted rounded-md overflow-hidden">
            <Image
              src={character.avatarUrl || `https://picsum.photos/seed/${encodeURIComponent(character.name)}/400/400`}
              alt={`รูปประจำตัวของ ${character.name}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint="ภาพถ่ายบุคคล"
            />
          </AspectRatio>
        </CardContent>
      </Card>
    </Link>
  );
}
