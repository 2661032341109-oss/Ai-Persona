
'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import {
  Paintbrush,
  Settings,
  Monitor,
  Sun,
  Moon,
  CaseSensitive,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const fonts = [
  { name: 'Sarabun', value: 'font-sarabun' },
  { name: 'IBM Plex Sans Thai', value: 'font-ibm-plex-sans-thai' },
  { name: 'Noto Sans Thai', value: 'font-noto-sans-thai' },
];

export function SettingsDialog() {
  const { setTheme, theme } = useTheme();
  const [selectedFont, setSelectedFont] = React.useState('font-sarabun');

  React.useEffect(() => {
    document.body.classList.remove(...fonts.map(f => f.value));
    document.body.classList.add(selectedFont);
  }, [selectedFont]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
          <span className="sr-only">การตั้งค่า</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>การตั้งค่า</DialogTitle>
          <DialogDescription>
            ปรับแต่งหน้าตาและประสบการณ์การใช้งานของแอปพลิเคชัน
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-3">
            <Label htmlFor="theme">
              <Paintbrush className="mr-2 h-4 w-4 inline-block" />
              ธีมสี
            </Label>
            <div className="grid grid-cols-3 gap-2 rounded-lg border p-1">
              <Button
                variant={theme === 'light' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setTheme('light')}
              >
                <Sun className="mr-2 h-4 w-4" />
                สว่าง
              </Button>
              <Button
                variant={theme === 'dark' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setTheme('dark')}
              >
                <Moon className="mr-2 h-4 w-4" />
                มืด
              </Button>
              <Button
                variant={theme === 'system' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setTheme('system')}
              >
                <Monitor className="mr-2 h-4 w-4" />
                ระบบ
              </Button>
            </div>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="font-select">
              <CaseSensitive className="mr-2 h-4 w-4 inline-block" />
              ฟอนต์
            </Label>
            <Select value={selectedFont} onValueChange={setSelectedFont}>
              <SelectTrigger id="font-select" className="w-full">
                <SelectValue placeholder="เลือกฟอนต์" />
              </SelectTrigger>
              <SelectContent>
                {fonts.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
