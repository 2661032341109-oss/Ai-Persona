
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, PanelLeft } from 'lucide-react';
import type { Character } from '@/lib/characters';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AspectRatio } from '../ui/aspect-ratio';
import { Sidebar, SidebarTrigger, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '../ui/sidebar';

interface ChatLayoutProps {
  character: Character;
  children: React.ReactNode;
}

export function ChatLayout({ character, children }: ChatLayoutProps) {
  return (
    <div className="flex h-screen md:h-[calc(100vh-theme(height.14))]">
        <Sidebar collapsible="icon" className="hidden md:flex">
            <SidebarHeader className="p-4">
                 <SidebarMenuButton tooltip="ตัวละครทั้งหมด" size="sm" asChild>
                    <Link href="/">
                        <ArrowLeft />
                        <span className="group-data-[collapsible=icon]:hidden">ตัวละครทั้งหมด</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarHeader>
            <SidebarContent className="p-4">
                <AspectRatio ratio={1/1} className="rounded-lg overflow-hidden mb-4 group-data-[collapsible=icon]:hidden">
                    <Image
                        src={character.avatarUrl || `https://picsum.photos/seed/${encodeURIComponent(character.name)}/400/400`}
                        alt={`รูปประจำตัวของ ${character.name}`}
                        fill
                        className="object-cover"
                        data-ai-hint="ภาพถ่ายบุคคล"
                    />
                </AspectRatio>
                <div className="group-data-[collapsible=icon]:hidden">
                    <h2 className="text-2xl font-bold font-headline">{character.name}</h2>
                    <p className="text-sm text-muted-foreground mt-1">{character.tagline}</p>
                </div>
                 <Separator className="my-4 group-data-[collapsible=icon]:hidden"/>
                <div className="flex-1 overflow-y-auto text-sm space-y-4 group-data-[collapsible=icon]:hidden">
                    <div>
                        <h3 className="font-semibold text-foreground/80 mb-2">บุคลิกภาพ</h3>
                        <p className="text-muted-foreground">{character.description}</p>
                    </div>
                    {character.history && (
                        <div>
                        <h3 className="font-semibold text-foreground/80 mb-2">ประวัติ</h3>
                        <p className="text-muted-foreground whitespace-pre-wrap">{character.history}</p>
                        </div>
                    )}
                </div>
            </SidebarContent>
        </Sidebar>
      <div className="flex-1 flex flex-col bg-muted/20">
         <header className="md:hidden flex items-center justify-between p-2 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10 h-14">
            <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                    <ArrowLeft />
                </Link>
            </Button>
            <div className="flex items-center gap-2">
                 <Image
                    src={character.avatarUrl || `https://picsum.photos/seed/${encodeURIComponent(character.name)}/400/400`}
                    alt={character.name}
                    width={32}
                    height={32}
                    className="object-cover rounded-full"
                />
                <span className="font-semibold">{character.name}</span>
            </div>
            <SidebarTrigger>
                <PanelLeft/>
            </SidebarTrigger>
        </header>
        {children}
      </div>
    </div>
  );
}
