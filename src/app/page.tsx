
'use client';

import Link from 'next/link';
import {
  Book,
  Coins,
  Home,
  MessageSquare,
  PlusCircle,
  Search,
  Settings,
  Sparkles,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CharacterCard } from '@/components/characters/character-card';
import { getCharactersWithLastMessage } from '@/lib/characters';
import { Character } from '@/lib/characters';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { SettingsDialog } from '@/components/settings-dialog';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarTrigger, SidebarFooter, SidebarInset } from '@/components/ui/sidebar';


type CharacterWithLastMessage = Character & { lastMessage?: string };

export default function HomePage() {
  const [characters, setCharacters] = React.useState<CharacterWithLastMessage[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const router = useRouter();


  const fetchCharacters = useCallback(async () => {
    const chars = await getCharactersWithLastMessage();
    setCharacters(chars.reverse());
  }, []);
  
  React.useEffect(() => {
    fetchCharacters();
  }, [fetchCharacters]);
  
  const handleCharacterDeleted = () => {
    fetchCharacters(); // Re-fetch characters after one is deleted
  };

  const filteredCharacters = characters.filter(character => 
    character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    character.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
    character.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );


  return (
    <SidebarProvider>
    <div className="flex min-h-screen bg-muted/40 font-sans">
        <Sidebar collapsible="icon" className="group-data-[variant=floating]:-ml-2 md:group-data-[variant=floating]:-ml-0">
            <SidebarHeader>
                 <div className="flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-primary" />
                    <h1 className="text-2xl font-bold group-data-[collapsible=icon]:hidden">Khui AI</h1>
                </div>
            </SidebarHeader>
            <SidebarContent>
                 <div className="mb-4 p-2">
                    <Button variant="outline" className="w-full justify-center gap-2">
                        <Coins className="text-amber-500"/>
                        <span className="group-data-[collapsible=icon]:hidden">เช็คอินรายวัน</span>
                    </Button>
                </div>
                <SidebarMenu>
                    <SidebarMenuItem>
                         <SidebarMenuButton tooltip="หน้าหลัก" isActive>
                            <Home />
                             <span className="group-data-[collapsible=icon]:hidden">หน้าหลัก</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                     <SidebarMenuItem>
                        <SidebarMenuButton tooltip="สร้างตัวละคร" asChild>
                             <Link href="/character/create">
                                <PlusCircle />
                                <span className="group-data-[collapsible=icon]:hidden">สร้างตัวละคร</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                     <SidebarMenuItem>
                        <SidebarMenuButton tooltip="แชทล่าสุด">
                            <MessageSquare />
                             <span className="group-data-[collapsible=icon]:hidden">แชทล่าสุด</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                     <SidebarMenuItem>
                        <SidebarMenuButton tooltip="คลังตัวละคร">
                            <Book />
                            <span className="group-data-[collapsible=icon]:hidden">คลังตัวละคร</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
             <SidebarFooter className="group-data-[collapsible=icon]:hidden">
                <div className="text-sm text-muted-foreground space-y-1">
                    <p className="hover:text-primary cursor-pointer">Discord</p>
                    <p className="hover:text-primary cursor-pointer">Facebook</p>
                    <p className="hover:text-primary cursor-pointer">Linktree</p>
                </div>
                <Separator className="my-2" />
                <p className="text-xs text-muted-foreground">
                    ข้อกำหนด & ความเป็นส่วนตัว
                </p>
            </SidebarFooter>
        </Sidebar>

      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10 h-14">
           <SidebarTrigger className="md:hidden"/>
          <div className="flex-1 max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="ค้นหาตัวละคร, แท็ก, หรือคำโปรย..." 
                className="pl-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <Badge variant="outline" className="gap-2 p-2">
              <Coins className="text-amber-500" />
              24
            </Badge>
            <Button className="bg-gradient-to-r from-primary to-accent text-white hidden sm:flex">เติมคอยน์</Button>
            <SettingsDialog />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>บัญชีของฉัน</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2" />
                  โปรไฟล์
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2" />
                  การตั้งค่า
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>ออกจากระบบ</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 md:p-8 bg-gradient-to-br from-pink-50 via-rose-50 to-amber-50 dark:from-slate-900 dark:via-purple-950 dark:to-slate-950">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">สำรวจตัวละคร</h2>
            <Button asChild className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:shadow-emerald-500/50 transition-all transform hover:scale-105">
              <Link href="/character/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">สร้างตัวละครใหม่</span>
                <span className="sm:hidden">สร้าง</span>
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {filteredCharacters.map((character) => (
              <CharacterCard key={character.id} character={character} onCharacterDeleted={handleCharacterDeleted} />
            ))}
          </div>
        </main>
      </SidebarInset>
    </div>
    </SidebarProvider>
  );
}
