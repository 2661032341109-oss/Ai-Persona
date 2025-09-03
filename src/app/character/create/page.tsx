'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { addCharacter } from '@/lib/characters';
import { ArrowLeft, Bot, ImageIcon, Loader2, Sparkles, Wand2, X, PlusCircle, Trash2, UploadCloud, Flag, Shield, Eye, Tv, BookText, Gamepad2, Columns3, Rabbit, Smile, Mic, Star, Dumbbell, Handshake, Speech, History, SquarePlay, TvMinimal, Sticker, Globe, PocketKnife, CodeXml, Wrench, Stethoscope, School, Palette, ChefHat, Plane, Camera, Music2, Swords, BookHeart, Users, Crown, Skull, GraduationCap, ArrowUp, ArrowDown, HeartCrack, MessageCircleHeart, Footprints, WandSparkles, House, User, Cherry, Grape, Rocket, Clapperboard, FileText } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import React from 'react';
import { generateCharacterDetails } from '@/ai/flows/generate-character-details';
import { generateImage } from '@/ai/flows/generate-image';
import { generateCharacterFromDraft } from '@/ai/flows/generate-character-from-draft';
import type { GenerateCharacterDetailsInput, GenerateImageInput, GenerateCharacterFromDraftInput } from '@/ai/schemas';

const tagsConfig = {
  'ระดับเนื้อหา': [
    { name: 'ธงแดง', icon: Flag },
    { name: 'ธงเขียว', icon: Flag },
    { name: 'ธงเหลือง', icon: Flag },
    { name: 'ธงขาว', icon: Flag },
    { name: 'PG', icon: Shield },
    { name: 'NC', icon: Eye },
  ],
  'ประเภทสื่อ': [
    { name: 'อนิเมะ', icon: Tv },
    { name: 'มังงะ', icon: BookText },
    { name: 'วิดีโอเกม', icon: Gamepad2 },
    { name: 'ภาพยนตร์', icon: Clapperboard },
    { name: 'ซีรีส์', icon: Columns3 },
    { name: 'การ์ตูนตะวันตก', icon: Rabbit },
    { name: 'ตัวละครมีม', icon: Smile },
    { name: 'ออริจินอล', icon: Bot },
  ],
   'บทบาท': ['นักแสดง', 'นักร้อง', 'ไอดอล', 'นักกีฬา', 'นักธุรกิจ', 'นักการเมือง', 'บุคคลสำคัญในประวัติศาสตร์', 'ยูทูบเบอร์', 'สตรีมเมอร์', 'วีทูบเบอร์', 'อินฟลูเอนเซอร์เสมือน', 'มาเฟีย', 'ระบบ', 'วิศวะ', 'พ่อหมอ', 'หมอ', 'ครู', 'ศิลปิน', 'เชฟ', 'นักบิน', 'ช่างภาพ', 'นักดนตรี', 'โปรแกรมเมอร์', 'บอดี้การ์ด', 'หุ่นยนต์', 'นักวิทยาศาสตร์', 'นักสืบ', 'ตำรวจ', 'อัศวิน', 'นักบวช', 'แม่ชี', 'พ่อบ้าน', 'เทพเจ้า', 'คนไข้', 'พยาบาล', 'นักบุญ', 'ตัวร้าย', 'ฮีโร่', 'ขุนนาง', 'นักศึกษา', 'จักรพรรดิ', 'พระมเหสี', 'พระสนม', 'รัชทายาท'],
  'บุคลิกและลักษณะนิสัย': ['โรแมนติก', 'อ่อนโยน', 'ตลก', 'สยองขวัญ', 'ระทึกขวัญ', 'ดราม่า', 'ลึกลับ', 'ซึนเดเระ', 'คูเดเระ', 'ฉลาด', 'ขี้อาย', 'จริงจัง', 'ร่าเริง', 'ซุ่มซ่าม', 'แฟนออกสาว', 'หมาโกลเด้น', 'แมวดำ', 'อีนิกม่า', 'อัลฟ่า', 'เบต้า', 'โอเมก้า', 'เนิร์ด', 'หมาเด็ก', 'หมาแก่', 'ซามอยด์', 'เจ้าเล่ห์'],
  'ประเภท/องค์ประกอบเรื่อง': ['ไทยโบราณ', 'ผจญภัย', 'แฟนตาซี', 'แอคชัน', 'ชีวิตประจำวัน', 'ยุคกลาง', 'ข้ามมิติ', 'เกิดใหม่', 'ไซไฟ', 'หลังวันสิ้นโลก', 'จีนย้อนยุค'],
  'เพศและความสัมพันธ์': ['แฟน', 'แต่งงาน', 'ยาโอย', 'ยูริ', 'ชายหญิง', 'ชาย', 'หญิง', 'ไบเซ็กชวล', 'ฟูตะ', 'เฟมบอย', 'แฟนเก่า', 'คนที่ชอบ', 'เคะ', 'เมะ'],
  'ความสัมพันธ์': ['เพื่อน', 'เพื่อนร่วมห้อง', 'เพื่อนสนิท', 'น้องสาว', 'พี่ชาย', 'แม่', 'พ่อ', 'ลูกสาว', 'ลูกชาย'],
  'ช่วงอายุ': ['วัยรุ่น', 'ผู้ใหญ่'],
  'สิ่งมีชีวิตเหนือธรรมชาติ': ['ปีศาจ', 'เทวดา', 'วิญญาณ', 'ซาตาน', 'แม่มด', 'พ่อมด', 'เอลฟ์', 'แวมไพร์', 'มนุษย์หมาป่า', 'ซอมบี้', 'เอเลี่ยน', 'ยมทูต', 'กลายพันธุ์', 'มนุษย์สัตว์', 'เงือก', 'โทรล', 'ยักษ์', 'ก็อบลิน'],
  'อื่นๆ': ['อื่นๆ']
};


const formSchema = z.object({
  name: z.string().min(1, 'กรุณากรอกชื่อตัวละคร').max(40, 'ชื่อตัวละครต้องไม่เกิน 40 ตัวอักษร'),
  tagline: z.string().min(1, 'กรุณากรอกคำโปรย').max(100, 'คำโปรยต้องไม่เกิน 100 ตัวอักษร'),
  description: z.string().min(1, 'กรุณากรอกคำอธิบาย').max(4096, 'คำอธิบายต้องไม่เกิน 4096 ตัวอักษร'),
  greeting: z.string().min(1, 'กรุณากรอกคำทักทาย').max(2048, 'คำทักทายต้องไม่เกิน 2048 ตัวอักษร'),
  history: z.string().max(4096, 'ประวัติตัวละครต้องไม่เกิน 4096 ตัวอักษร').optional(),
  visibility: z.enum(['public', 'private']).default('public'),
  tags: z.array(z.string()).optional(),
  avatarUrl: z.string().optional(),
});

export default function CreateCharacterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedTags, setSelectedTags] = React.useState<string[]>(['ออริจินอล']);
  const [isGeneratingCharacter, setIsGeneratingCharacter] = React.useState(false);
  const [isGeneratingFromDraft, setIsGeneratingFromDraft] = React.useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = React.useState(false);
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      tagline: '',
      description: '',
      greeting: '',
      history: '',
      visibility: 'public',
      tags: ['ออริจินอล'],
    },
  });
  
  React.useEffect(() => {
    form.setValue('tags', selectedTags);
  }, [selectedTags, form]);

  const handleGenerateCharacter = async () => {
    setIsGeneratingCharacter(true);
    try {
      const currentValues = form.getValues();
      const input: GenerateCharacterDetailsInput = {
        prompt: `
        ชื่อตัวละคร: ${currentValues.name || 'สุ่ม'}
        คำโปรย: ${currentValues.tagline || 'สุ่ม'}
        ลักษณะนิสัย: ${currentValues.description || 'สุ่ม'}
        คำทักทาย: ${currentValues.greeting || 'สุ่ม'}
        แท็ก: ${selectedTags.join(', ')}
      `};
      const result = await generateCharacterDetails(input);
      form.setValue('name', result.name);
      form.setValue('tagline', result.tagline);
      form.setValue('description', result.personality);
      form.setValue('greeting', result.greeting);
      toast({
        title: 'สร้างข้อมูลตัวละครสำเร็จ!',
        description: 'AI ได้ช่วยคุณสร้างข้อมูลพื้นฐานของตัวละครแล้ว',
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถสร้างข้อมูลตัวละครได้ โปรดลองอีกครั้ง',
      });
    } finally {
      setIsGeneratingCharacter(false);
    }
  };

  const handleGenerateFromDraft = async () => {
    if (!draft.trim()) {
      toast({
        variant: 'destructive',
        title: 'ข้อมูลไม่ครบถ้วน',
        description: 'กรุณาใส่บทสรุปหรือข้อมูลร่างของตัวละคร',
      });
      return;
    }
    setIsGeneratingFromDraft(true);
    try {
      const input: GenerateCharacterFromDraftInput = { draft };
      const result = await generateCharacterFromDraft(input);
      form.setValue('name', result.name);
      form.setValue('tagline', result.tagline);
      form.setValue('description', result.personality);
      form.setValue('greeting', result.greeting);
      setSelectedTags(result.tags);
      toast({
        title: 'สร้างตัวละครจากบทสรุปสำเร็จ!',
        description: 'AI ได้กรอกข้อมูลจากบทสรุปของคุณแล้ว',
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถสร้างตัวละครจากบทสรุปได้ โปรดลองอีกครั้ง',
      });
    } finally {
      setIsGeneratingFromDraft(false);
    }
  };

  const handleGenerateImage = async () => {
    setIsGeneratingImage(true);
    setAvatarPreview(null);
    try {
      const currentValues = form.getValues();
      const input: GenerateImageInput = {
        prompt: `อนิเมะ, ${currentValues.name}, ${currentValues.tagline}, ${currentValues.description}, ${selectedTags.join(', ')}`
      };
      const result = await generateImage(input);
      if (result.imageUrl) {
        setAvatarPreview(result.imageUrl);
        form.setValue('avatarUrl', result.imageUrl);
        toast({
          title: 'สร้างรูปภาพสำเร็จ!',
          description: 'รูปโปรไฟล์ใหม่พร้อมใช้งานแล้ว',
        });
      } else {
        throw new Error('Image URL is missing');
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถสร้างรูปภาพได้ โปรดลองอีกครั้ง',
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newCharacter = {
        name: values.name,
        description: values.tagline,
        personality: values.description,
        background: values.history || '',
        greeting: values.greeting,
        avatarUrl: values.avatarUrl || `https://picsum.photos/400/400?random=${Date.now()}`
    }
    addCharacter(newCharacter);
    
    toast({
      title: 'สร้างตัวละครสำเร็จ!',
      description: `${values.name} ของคุณถูกสร้างขึ้นเรียบร้อยแล้ว`,
    });
    router.push('/');
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 bg-gradient-to-br from-pink-50 via-rose-50 to-amber-50 font-sans">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" size="sm" asChild>
            <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                กลับหน้าหลัก
            </Link>
        </Button>
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-center my-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500">
            สร้างตัวละคร
        </h1>
        <div></div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-sm border-rose-200/50 rounded-2xl">
                  <CardHeader>
                      <CardTitle className="text-rose-800">รูปโปรไฟล์</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <div className="aspect-square w-full rounded-2xl bg-rose-50/50 flex items-center justify-center overflow-hidden border-2 border-dashed border-rose-200">
                        {isGeneratingImage ? (
                          <div className="flex flex-col items-center gap-2 text-rose-600">
                            <Loader2 className="w-10 h-10 animate-spin text-rose-500"/>
                            <p>กำลังสร้างรูปภาพ...</p>
                          </div>
                        ) : avatarPreview ? (
                           <Image src={avatarPreview} alt="Generated Avatar" width={400} height={400} className="object-cover w-full h-full" />
                        ) : (
                           <div className="text-center text-rose-400 p-4 flex flex-col items-center justify-center">
                            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-rose-200" />
                            <p className="text-sm">รูปภาพจะแสดงที่นี่</p>
                          </div>
                        )}
                      </div>
                      <Button type="button" onClick={handleGenerateImage} disabled={isGeneratingCharacter || isGeneratingImage || isGeneratingFromDraft} className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold shadow-md hover:scale-105 transition-transform rounded-xl py-3">
                        {isGeneratingImage ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        <span>AI สร้างรูปภาพ (ฟรี)</span>
                      </Button>
                  </CardContent>
              </Card>

               <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-sm border-amber-200/50 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-amber-800 flex items-center gap-2">
                    <FileText />
                    สร้างจากบทสรุป
                  </CardTitle>
                  <CardDescription>
                    วางบทสรุปหรือข้อมูลร่างของตัวละคร แล้วให้ AI ช่วยกรอกข้อมูลโดยอัตโนมัติ
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="วางบทสรุปตัวละครของคุณที่นี่..."
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    rows={8}
                    className="focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 rounded-lg border-amber-200/80"
                  />
                  <Button type="button" onClick={handleGenerateFromDraft} disabled={isGeneratingCharacter || isGeneratingImage || isGeneratingFromDraft} className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold shadow-md hover:scale-105 transition-transform rounded-xl py-3">
                    {isGeneratingFromDraft ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                    <span>AI ช่วยกรอกข้อมูล (ฟรี)</span>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-8">
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-sm border-rose-200/50 rounded-2xl">
                  <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-rose-800">ข้อมูลพื้นฐาน</CardTitle>
                      <Button type="button" variant="ghost" onClick={handleGenerateCharacter} disabled={isGeneratingCharacter || isGeneratingImage || isGeneratingFromDraft}>
                          {isGeneratingCharacter ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                          AI ช่วยเขียน
                      </Button>
                  </CardHeader>
                  <CardContent className="space-y-6">
                      <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                          <FormItem>
                              <FormLabel>ชื่อตัวละคร *</FormLabel>
                              <FormControl>
                              <Input placeholder="e.g. เอมิลี่" {...field} maxLength={40} className="focus:ring-rose-500 focus:border-rose-500 transition-all duration-300 rounded-lg border-rose-200/80"/>
                              </FormControl>
                              <FormDescription className='flex justify-end text-xs text-muted-foreground pr-2'>{field.value.length}/40</FormDescription>
                              <FormMessage />
                          </FormItem>
                          )}
                      />

                      <FormField
                          control={form.control}
                          name="tagline"
                          render={({ field }) => (
                          <FormItem>
                              <FormLabel>คำโปรย *</FormLabel>
                              <FormControl>
                              <Textarea placeholder="e.g. เพื่อนร่วมห้องคนใหม่ที่เข้ามาป่วนหัวใจ" {...field} maxLength={100} className="focus:ring-rose-500 focus:border-rose-500 transition-all duration-300 rounded-lg border-rose-200/80"/>
                              </FormControl>
                              <FormDescription className='flex justify-end text-xs text-muted-foreground pr-2'>{field.value.length}/100</FormDescription>
                              <FormMessage />
                          </FormItem>
                          )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="tags"
                        render={() => (
                          <FormItem>
                            <FormLabel>แท็กตัวละคร (สูงสุด 10 แท็ก)</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button variant="outline" className="w-full justify-start font-normal h-auto flex-wrap hover:border-rose-300 transition-colors rounded-lg border-rose-200/80 min-h-[40px]">
                                    {selectedTags.length > 0 ? (
                                      selectedTags.map(tag => (
                                        <Badge key={tag} variant="secondary" className="m-1 text-sm bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                                          {tag}
                                          <span
                                            role="button"
                                            className="ml-2 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              setSelectedTags(prev => prev.filter(t => t !== tag));
                                            }}
                                          >
                                            <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                          </span>
                                        </Badge>
                                      ))
                                    ) : (
                                      <span className="text-muted-foreground">เลือกแท็ก</span>
                                    )}
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-[400px] p-0 rounded-xl shadow-2xl border-rose-200">
                                <Command>
                                  <CommandInput placeholder="ค้นหาแท็ก..." className="focus:ring-rose-500" />
                                  <CommandList>
                                    <CommandEmpty>ไม่พบแท็ก</CommandEmpty>
                                     {Object.entries(tagsConfig).map(([group, tags]) => (
                                      <CommandGroup key={group} heading={group}>
                                        {tags.map((tag, index) => {
                                          const TagIcon = typeof tag === 'object' ? tag.icon : null;
                                          const tagName = typeof tag === 'object' ? tag.name : tag;
                                          return (
                                            <CommandItem
                                              key={`${group}-${tagName}-${index}`}
                                              onSelect={() => {
                                                if (selectedTags.includes(tagName)) {
                                                  setSelectedTags(prev => prev.filter(t => t !== tagName));
                                                } else if (selectedTags.length < 10) {
                                                  setSelectedTags(prev => [...prev, tagName]);
                                                }
                                              }}
                                              className="cursor-pointer hover:bg-rose-50 aria-selected:bg-rose-100 aria-selected:text-rose-900"
                                            >
                                              <div
                                                className={cn(
                                                  "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                  selectedTags.includes(tagName)
                                                    ? "bg-primary text-primary-foreground"
                                                    : "opacity-50 [&_svg]:invisible"
                                                )}
                                              >
                                                <Check className={cn("h-4 w-4")} />
                                              </div>
                                              {TagIcon && <TagIcon className="mr-2 h-4 w-4 text-muted-foreground" />}
                                              <span>{tagName}</span>
                                            </CommandItem>
                                          )
                                        })}
                                      </CommandGroup>
                                    ))}
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            <FormDescription>
                              เลือกแท็กที่เกี่ยวข้องกับตัวละครของคุณ
                            </FormDescription>
                          </FormItem>
                        )}
                      />

                      <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                          <FormItem>
                              <FormLabel>คำอธิบาย * (ข้อมูลสำหรับ AI)</FormLabel>
                              <FormControl>
                              <Textarea placeholder="e.g. เอมิลี่เป็นนักศึกษาสาวชาวอเมริกันที่ร่าเริงและชอบหยอกล้อ เธอมีความมั่นใจและตรงไปตรงมา..." {...field} rows={6} maxLength={4096} className="focus:ring-rose-500 focus:border-rose-500 transition-all duration-300 rounded-lg border-rose-200/80"/>
                              </FormControl>
                              <FormDescription className='flex justify-end text-xs text-muted-foreground pr-2'>{field.value.length}/4096</FormDescription>
                              <FormMessage />
                          </FormItem>
                          )}
                      />
                      
                      <FormField
                          control={form.control}
                          name="greeting"
                          render={({ field }) => (
                          <FormItem>
                              <FormLabel>คำทักทาย *</FormLabel>
                              <FormControl>
                              <Textarea placeholder="e.g. เฮ้! ในที่สุดก็เจอตัวซะทีนะรูมเมท ว่าแต่...นาย/เธอชื่ออะไรนะ?" {...field} rows={4} maxLength={2048} className="focus:ring-rose-500 focus:border-rose-500 transition-all duration-300 rounded-lg border-rose-200/80"/>
                              </FormControl>
                              <FormDescription className='flex justify-end text-xs text-muted-foreground pr-2'>{field.value.length}/2048</FormDescription>
                              <FormMessage />
                          </FormItem>
                          )}
                      />

                      <FormField
                          control={form.control}
                          name="history"
                          render={({ field }) => (
                          <FormItem>
                              <FormLabel>ประวัติตัวละคร (สำหรับผู้ใช้ดูเท่านั้น, ไม่บังคับ)</FormLabel>
                              <FormControl>
                              <Textarea placeholder="e.g. เอมิลี่มาจากเมืองเล็กๆ ในรัฐแคลิฟอร์เนีย เธอได้รับทุนการศึกษาเพื่อมาเรียนที่ประเทศไทย..." {...field} rows={6} maxLength={4096} className="focus:ring-rose-500 focus:border-rose-500 transition-all duration-300 rounded-lg border-rose-200/80"/>
                              </FormControl>
                              <FormDescription className='flex justify-end text-xs text-muted-foreground pr-2'>{field.value?.length || 0}/4096</FormDescription>
                              <FormMessage />
                          </FormItem>
                          )}
                      />
                  </CardContent>
              </Card>

              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-sm border-rose-200/50 rounded-2xl">
                  <CardHeader>
                      <CardTitle className="text-rose-800">การมองเห็น *</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <FormField
                          control={form.control}
                          name="visibility"
                          render={({ field }) => (
                          <FormItem className="space-y-3">
                              <FormControl>
                              <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex flex-col space-y-1"
                              >
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                      <RadioGroupItem value="public" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                      สาธารณะ (ทุกคนมองเห็นและแชทได้)
                                  </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                      <RadioGroupItem value="private" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                      ส่วนตัว (คุณเท่านั้นที่มองเห็น)
                                  </FormLabel>
                                  </FormItem>
                              </RadioGroup>
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                          )}
                      />
                  </CardContent>
              </Card>
            </div>
          </div>
           
            <div className="flex justify-center mt-8">
                <Button type="submit" size="lg" className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold shadow-lg hover:scale-110 transition-transform rounded-full px-12 py-6 text-lg">
                  <Rocket className="mr-2 h-5 w-5"/>
                  สร้างตัวละคร
                </Button>
            </div>
             <p className="text-xs text-muted-foreground text-center mt-4">
                โปรดตรวจสอบให้แน่ใจว่าตัวละครเป็นไปตาม <Link href="#" className="underline hover:text-primary">ข้อกำหนดและเงื่อนไข</Link>
            </p>
        </form>
      </Form>
    </div>
  );
}
