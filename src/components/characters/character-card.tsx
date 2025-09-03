
'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Character } from '@/lib/characters';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Trash2, Edit } from 'lucide-react';
import { deleteCharacter } from '@/lib/characters';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import React from 'react';


interface CharacterCardProps {
  character: Character & { lastMessage?: string };
  onCharacterDeleted: () => void;
}

export function CharacterCard({ character, onCharacterDeleted }: CharacterCardProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
      setIsDeleting(true);
      try {
          await deleteCharacter(character.id);
          toast({
              title: "ลบตัวละครสำเร็จ",
              description: `ตัวละคร "${character.name}" ถูกลบแล้ว`,
          });
          onCharacterDeleted();
      } catch (error) {
          toast({
              variant: "destructive",
              title: "เกิดข้อผิดพลาด",
              description: "ไม่สามารถลบตัวละครได้",
          });
          setIsDeleting(false);
      }
  };


  return (
    <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 ease-in-out group hover:shadow-xl hover:-translate-y-1 hover:shadow-primary/20 rounded-2xl border-stone-200/60 bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm dark:border-slate-700">
        <CardHeader className="flex-row items-start justify-between p-4">
            <div className='w-full'>
                <CardTitle className="font-headline tracking-tight text-lg text-gray-800 dark:text-gray-200 pr-8">{character.name}</CardTitle>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{character.tagline}</p>
            </div>
            <AlertDialog>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0 -mt-1 -mr-2">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            แก้ไข
                        </DropdownMenuItem>
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                 ลบ
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                    </DropdownMenuContent>
                </DropdownMenu>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>คุณแน่ใจหรือไม่?</AlertDialogTitle>
                        <AlertDialogDescription>
                            การกระทำนี้ไม่สามารถย้อนกลับได้ การดำเนินการนี้จะลบตัวละครและข้อมูลการสนทนาทั้งหมดของคุณอย่างถาวร
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                           {isDeleting ? "กำลังลบ..." : "ยืนยันการลบ"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </CardHeader>
        <CardContent className="p-4 pt-0 flex-1">
            <Link href={`/chat/${character.id}`} className="group/image block">
                <AspectRatio ratio={1 / 1} className="bg-muted rounded-xl overflow-hidden">
                    <Image
                    src={character.avatarUrl || `https://picsum.photos/seed/${encodeURIComponent(character.name)}/400/400`}
                    alt={`รูปประจำตัวของ ${character.name}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover/image:scale-105"
                    data-ai-hint="ภาพถ่ายบุคคล"
                    />
                </AspectRatio>
            </Link>
        </CardContent>
        {character.lastMessage && (
            <CardFooter className="p-4 pt-0">
                <Link href={`/chat/${character.id}`} className="w-full">
                    <div className="text-xs text-muted-foreground bg-gray-100/80 dark:bg-slate-700/50 p-3 rounded-lg w-full line-clamp-2 hover:bg-gray-200/70 dark:hover:bg-slate-600/60 transition-colors">
                        <span className="font-semibold text-gray-600 dark:text-gray-300">ล่าสุด:</span> {character.lastMessage}
                    </div>
                </Link>
            </CardFooter>
        )}
    </Card>
  );
}
