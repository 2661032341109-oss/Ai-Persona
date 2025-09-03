
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
import { ArrowLeft, Bot, ImageIcon, Loader2, Sparkles, Wand2, X, PlusCircle, Trash2, UploadCloud, Flag, Shield, Eye, Tv, BookText, Gamepad2, Columns3, Rabbit, Smile, Mic, Star, Dumbbell, Handshake, Speech, History, SquarePlay, TvMinimal, Sticker, Globe, PocketKnife, CodeXml, Wrench, Stethoscope, School, Palette, ChefHat, Plane, Camera, Music2, Swords, BookHeart, Users, Crown, Skull, GraduationCap, ArrowUp, ArrowDown, HeartCrack, MessageCircleHeart, Footprints, WandSparkles, House, User, Cherry, Grape, Rocket, Clapperboard, FileText, PersonStanding, HandHeart, Laugh, Ghost, Frown, CircleHelp, Omega, Glasses, Dog, ScrollText, Bird, Flame, Zap, Mountain, Bug, Ellipsis } from 'lucide-react';
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
  CommandSeparator,
} from '@/components/ui/command';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import React from 'react';
import { generateCharacterDetails } from '@/ai/flows/generate-character-details';
import { generateImage } from '@/ai/flows/generate-image';
import { generateCharacterFromDraft } from '@/ai/flows/generate-character-from-draft';
import type { GenerateCharacterDetailsInput, GenerateImageInput, GenerateCharacterFromDraftInput } from '@/ai/schemas';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

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
   'บทบาท': [{ name: 'นักแสดง', icon: PersonStanding}, { name: 'นักร้อง', icon: Mic }, { name: 'ไอดอล', icon: Star }, { name: 'นักกีฬา', icon: Dumbbell }, { name: 'นักธุรกิจ', icon: Handshake }, { name: 'นักการเมือง', icon: Speech }, { name: 'บุคคลสำคัญในประวัติศาสตร์', icon: History }, { name: 'ยูทูบเบอร์', icon: SquarePlay }, { name: 'สตรีมเมอร์', icon: TvMinimal }, { name: 'วีทูบเบอร์', icon: Sticker }, { name: 'อินฟลูเอนเซอร์เสมือน', icon: Globe }, { name: 'มาเฟีย', icon: PocketKnife }, { name: 'ระบบ', icon: CodeXml }, { name: 'วิศวะ', icon: Wrench }, { name: 'พ่อหมอ', icon: Sparkles }, { name: 'หมอ', icon: Stethoscope }, { name: 'ครู', icon: School }, { name: 'ศิลปิน', icon: Palette }, { name: 'เชฟ', icon: ChefHat }, { name: 'นักบิน', icon: Plane }, { name: 'ช่างภาพ', icon: Camera }, { name: 'นักดนตรี', icon: Music2 }, { name: 'โปรแกรมเมอร์', icon: CodeXml }, { name: 'บอดี้การ์ด', icon: Shield }, { name: 'หุ่นยนต์', icon: Bot }, { name: 'นักวิทยาศาสตร์', icon: GraduationCap }, { name: 'นักสืบ', icon: Eye }, { name: 'ตำรวจ', icon: Shield }, { name: 'อัศวิน', icon: Swords }, { name: 'นักบวช', icon: BookText }, { name: 'แม่ชี', icon: BookHeart }, { name: 'พ่อบ้าน', icon: Users }, { name: 'เทพเจ้า', icon: Crown }, { name: 'คนไข้', icon: Stethoscope }, { name: 'พยาบาล', icon: Stethoscope }, { name: 'นักบุญ', icon: Star }, { name: 'ตัวร้าย', icon: Skull }, { name: 'ฮีโร่', icon: Shield }, { name: 'ขุนนาง', icon: Crown }, { name: 'นักศึกษา', icon: GraduationCap }, { name: 'จักรพรรดิ', icon: Crown }, { name: 'พระมเหสี', icon: Crown }, { name: 'พระสนม', icon: HeartCrack }, { name: 'รัชทายาท', icon: Star }],
  'บุคลิกและลักษณะนิสัย': [{ name: 'โรแมนติก', icon: MessageCircleHeart }, { name: 'อ่อนโยน', icon: HandHeart }, { name: 'ตลก', icon: Laugh }, { name: 'สยองขวัญ', icon: Ghost }, { name: 'ระทึกขวัญ', icon: Skull }, { name: 'ดราม่า', icon: Frown }, { name: 'ลึกลับ', icon: Eye }, { name: 'ซึนเดเระ', icon: HandHeart }, { name: 'คูเดระ', icon: Eye }, { name: 'ฉลาด', icon: Bot }, { name: 'ขี้อาย', icon: User }, { name: 'จริงจัง', icon: FileText }, { name: 'ร่าเริง', icon: Smile }, { name: 'ซุ่มซ่าม', icon: Rabbit }, { name: 'แฟนออกสาว', icon: Users }, { name: 'หมาโกลเด้น', icon: Dog }, { name: 'แมวดำ', icon: Dog }, { name: 'อีนิกม่า', icon: CircleHelp }, { name: 'อัลฟ่า', icon: Crown }, { name: 'เบต้า', icon: Shield }, { name: 'โอเมก้า', icon: Omega }, { name: 'เนิร์ด', icon: Glasses }, { name: 'หมาเด็ก', icon: Dog }, { name: 'หมาแก่', icon: Dog }, { name: 'ซามอยด์', icon: Dog }, { name: 'เจ้าเล่ห์', icon: Eye }],
  'ประเภท/องค์ประกอบเรื่อง': [{ name: 'ไทยโบราณ', icon: ScrollText }, { name: 'ผจญภัย', icon: Footprints }, { name: 'แฟนตาซี', icon: WandSparkles }, { name: 'แอคชัน', icon: Swords }, { name: 'ชีวิตประจำวัน', icon: Handshake }, { name: 'ยุคกลาง', icon: Swords }, { name: 'ข้ามมิติ', icon: Globe }, { name: 'เกิดใหม่', icon: ArrowUp }, { name: 'ไซไฟ', icon: Bot }, { name: 'หลังวันสิ้นโลก', icon: Skull }, { name: 'จีนย้อนยุค', icon: ScrollText }],
  'เพศและความสัมพันธ์': [{ name: 'แฟน', icon: HeartCrack }, { name: 'แต่งงาน', icon: HandHeart }, { name: 'ยาโอย', icon: HandHeart }, { name: 'ยูริ', icon: BookHeart }, { name: 'ชายหญิง', icon: MessageCircleHeart }, { name: 'ชาย', icon: User }, { name: 'หญิง', icon: User }, { name: 'ไบเซ็กชวล', icon: HandHeart }, { name: 'ฟูตะ', icon: Users }, { name: 'เฟมบอย', icon: HeartCrack }, { name: 'แฟนเก่า', icon: HeartCrack }, { name: 'คนที่ชอบ', icon: MessageCircleHeart }, { name: 'เคะ', icon: ArrowDown }, { name: 'เมะ', icon: ArrowUp }],
  'ความสัมพันธ์': [{ name: 'เพื่อน', icon: Users }, { name: 'เพื่อนร่วมห้อง', icon: House }, { name: 'เพื่อนสนิท', icon: Users }, { name: 'น้องสาว', icon: Users }, { name: 'พี่ชาย', icon: Users }, { name: 'แม่', icon: Users }, { name: 'พ่อ', icon: Users }, { name: 'ลูกสาว', icon: Users }, { name: 'ลูกชาย', icon: Users }],
  'ช่วงอายุ': [{ name: 'วัยรุ่น', icon: PersonStanding }, { name: 'ผู้ใหญ่', icon: GraduationCap }],
  'สิ่งมีชีวิตเหนือธรรมชาติ': [{ name: 'ปีศาจ', icon: Flame }, { name: 'เทวดา', icon: Bird }, { name: 'วิญญาณ', icon: Ghost }, { name: 'ซาตาน', icon: Zap }, { name: 'แม่มด', icon: WandSparkles }, { name: 'พ่อมด', icon: User }, { name: 'เอลฟ์', icon: Sparkles }, { name: 'แวมไพร์', icon: Zap }, { name: 'มนุษย์หมาป่า', icon: Dog }, { name: 'ซอมบี้', icon: Skull }, { name: 'เอเลี่ยน', icon: Globe }, { name: 'ยมทูต', icon: Skull }, { name: 'กลายพันธุ์', icon: Zap }, { name: 'มนุษย์สัตว์', icon: Dog }, { name: 'เงือก', icon: Cherry }, { name: 'โทรล', icon: Mountain }, { name: 'ยักษ์', icon: Mountain }, { name: 'ก็อบลิน', icon: Bug }],
  'อื่นๆ': [{ name: 'อื่นๆ', icon: Ellipsis }]
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
  const [isSubmitting, setIsSubmitting] = React.useState(false);


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
      avatarUrl: '',
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
        สร้างตัวละครที่มีข้อมูลต่อไปนี้:
        ชื่อตัวละคร: ${currentValues.name || 'สุ่ม'}
        คำโปรย: ${currentValues.tagline || 'สุ่ม'}
        ลักษณะนิสัย: ${currentValues.description || 'สุ่ม'}
        คำทักทาย: ${currentValues.greeting || 'สุ่ม'}
        แท็ก: ${selectedTags.join(', ')}
        กรุณาสร้างข้อมูลทั้งหมดเป็นภาษาไทย
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
        await addCharacter({
            name: values.name,
            tagline: values.tagline,
            description: values.description,
            greeting: values.greeting,
            history: values.history || '',
            visibility: values.visibility,
            tags: values.tags,
            avatarUrl: values.avatarUrl,
        });
        
        toast({
        title: 'สร้างตัวละครสำเร็จ!',
        description: `${values.name} ของคุณถูกสร้างขึ้นเรียบร้อยแล้ว`,
        });
        router.push('/');
    } catch (error) {
        console.error("Failed to create character:", error);
        toast({
            variant: "destructive",
            title: "เกิดข้อผิดพลาด",
            description: "ไม่สามารถสร้างตัวละครได้ โปรดลองอีกครั้ง"
        });
    } finally {
        setIsSubmitting(false);
    }
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
                                          const TagIcon = typeof tag === 'object' && tag.icon ? tag.icon : null;
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
                <Button type="submit" size="lg" disabled={isSubmitting} className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold shadow-lg hover:scale-110 transition-transform rounded-full px-12 py-6 text-lg">
                  {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Rocket className="mr-2 h-5 w-5"/>}
                  {isSubmitting ? 'กำลังสร้าง...' : 'สร้างตัวละคร'}
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
