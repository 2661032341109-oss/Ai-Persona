'use client';

import Link from 'next/link';
import {
  Book,
  Code2,
  Coins,
  Home,
  MessageSquare,
  PlusCircle,
  Settings,
  Sparkles,
  User,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CharacterCard } from '@/components/characters/character-card';
import { getCharacters } from '@/lib/characters';
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
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function HomePage() {
  const characters = getCharacters();

  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="w-64 bg-background border-r p-4 flex-col hidden md:flex">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Khui AI</h1>
        </div>
        <div className="mb-4">
          <Button className="w-full justify-center gap-2">
            <Code2 />
            กรอกโค้ด
          </Button>
        </div>
        <Card className="text-center p-4 mb-6">
          <CardHeader>
            <CardTitle>เช็คอินรายวัน</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              รับคอยน์ฟรี! และร่วมกิจกรรมแจกคอยน์อื่นๆ
            </p>
            <Button variant="outline">วันนี้</Button>
          </CardContent>
        </Card>

        <nav className="flex-1 space-y-2">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Home />
            ไปหน้าหลัก
          </Button>
          <Button variant="secondary" className="w-full justify-start gap-2">
            <PlusCircle />
            สร้างตัวละคร
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <MessageSquare />
            แชทส่วนตัว
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Users />
            แชทกลุ่ม
          </Button>
        </nav>
        <div className="mt-auto">
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Discord</p>
            <p>Facebook</p>
            <p>Linktree</p>
          </div>
          <Separator className="my-2" />
          <p className="text-xs text-muted-foreground">
            ข้อกำหนด & ความเป็นส่วนตัว
          </p>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-4 border-b bg-background">
          <div />
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="gap-2">
              <Coins />
              24 คอยน์
            </Badge>
            <Button>เติม</Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
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

        <main className="flex-1 p-8 bg-muted/20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">เลือกคู่หูของคุณ</h2>
            <Button asChild>
              <Link href="/character/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                สร้างตัวละคร
              </Link>
            </Button>
          </div>

          <div className="mb-6">
            <Input placeholder="ค้นหาตัวละคร..." />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {characters.map((character) => (
              <CharacterCard key={character.id} character={character} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}