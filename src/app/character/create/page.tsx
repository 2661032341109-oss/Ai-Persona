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
import { ArrowLeft, Bot, ImageIcon, Loader2, Sparkles, Wand2, X, PlusCircle, Trash2, UploadCloud, Flag, Shield, Eye, Tv, BookText, Gamepad2, Columns3, Rabbit, Smile, Mic, Star, Dumbbell, Handshake, Speech, History, SquarePlay, TvMinimal, Sticker, Globe, PocketKnife, CodeXml, Wrench, Stethoscope, School, Palette, ChefHat, Plane, Camera, Music2, Swords, BookHeart, Users, Crown, Skull, GraduationCap, ArrowUp, ArrowDown, HeartCrack, MessageCircleHeart, Footprints, WandSparkles, House, User, Cherry, Grape, Rocket } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Image from 'next/image';
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

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import React from 'react';
import { generateCharacterDetails } from '@/ai/flows/generate-character-details';
import { generateImage } from '@/ai/flows/generate-image';
import type { GenerateCharacterDetailsInput, GenerateImageInput } from '@/ai/schemas';

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
   'บทบาท': ['นักแสดง', 'นักร้อง', 'ไอดอล', 'นักกีฬา', 'นักธุรกิจ', 'นักการเมือง', 'บุคคลสำคัญในประวัติศาสตร์', 'ยูทูบเบอร์', 'สตรีมเมอร์', 'วีทูบเบอร์', 'อินฟลูเอนเซอร์เสมือน', 'มาเฟีย', 'ระบบ', 'วิศวะ', 'พ่อหมอ', 'หมอ', 'ครู', 'ศิลปิน', 'เชฟ', 'นักบิน', 'ช่างภาพ', 'นักดนตรี', 'โปรแกรมเมอร์', 'บอดี้การ์ด', 'หุ่นยนต์', 'นักวิทยาศาสตร์', 'นักสืบ', 'ตำรวจ', 'อัศวิน', 'นักบวช', 'แม่ชี', 'พ่อบ้าน', 'เทพเจ้า', 'คนไข้', 'พยาบาล', 'นักบุญ', 'ตัวร้าย', 'ฮีโร่', 'ขุนนาง', 'นักศึกษา', 'จักพรรดื', 'พระมเหสี', 'พระสนม', 'รัชทายาท'],
  'บุคลิกและลักษณะนิสัย': ['โรแมนติก', 'อ่อนโยน', 'ตลก', 'สยองขวัญ', 'ระทึกขวัญ', 'ดราม่า', 'ลึกลับ', 'ซึนเดเระ', 'คุเดเระ', 'ฉลาด', 'ขี้อาย', 'จริงจัง', 'ร่าเริง', 'ซุ่มซ่าม', 'แฟนออกสาว', 'หมาโกลเด้น', 'แมวดำ', 'อีนิกม่า', 'อัลฟ่า', 'เบต้า', 'โอเมก้า', 'เนิร์ด', 'หมาเด็ก', 'หมาแก่', 'ซามอยด์', 'เจ้าเล่ห์'],
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
  defaultUserRoleName: z.string().max(40, 'ชื่อบทบาทผู้ใช้ต้องไม่เกิน 40 ตัวอักษร').optional(),
  defaultUserRoleDescription: z.string().max(2048, 'รายละเอียดบทบาทผู้ใช้ต้องไม่เกิน 2048 ตัวอักษร').optional(),
  defaultScenarioName: z.string().max(40, 'ชื่อสถานการณ์ต้องไม่เกิน 40 ตัวอักษร').optional(),
  defaultScenarioDescription: z.string().max(2048, 'รายละเอียดสถานการณ์ต้องไม่เกิน 2048 ตัวอักษร').optional(),
  visibility: z.enum(['public', 'private']).default('public'),
  tags: z.array(z.string()).optional(),
  avatarUrl: z.string().optional(),
  profileImageOptions: z.array(z.string()).optional(),
});

export default function CreateCharacterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedTags, setSelectedTags] = React.useState<string[]>(['ออริจินอล']);
  const [isGeneratingCharacter, setIsGeneratingCharacter] = React.useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = React.useState(false);
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      tagline: '',
      description: '',
      greeting: '',
      history: '',
      visibility: 'public',
      defaultUserRoleName: '',
      defaultUserRoleDescription: '',
      defaultScenarioName: '',
      defaultScenarioDescription: '',
      tags: ['ออริจินอล'],
      profileImageOptions: [],
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
      title: 'สร้างตัวละครแล้ว!',
      description: `${values.name} ได้ถูกสร้างขึ้นแล้ว`,
    });
    router.push('/');
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" size="sm" asChild>
            <Link href="/">
                <ArrowLeft />
                กลับหน้าหลัก
            </Link>
        </Button>
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-center my-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
            สร้างตัวละคร
        </h1>
        <div className="flex gap-2">
            <Button variant="outline">บันทึกแบบร่าง</Button>
            <Button variant="secondary">ประวัติแบบร่าง</Button>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                      <CardTitle>รูปโปรไฟล์</CardTitle>
                      <CardDescription>
                          <Link href="#" className="text-primary underline text-sm">ข้อกำหนดการสร้าง</Link>
                      </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <div className="aspect-square w-full rounded-lg bg-muted flex items-center justify-center overflow-hidden border-2 border-dashed border-primary/20">
                        {isGeneratingImage ? (
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Loader2 className="w-10 h-10 animate-spin text-primary"/>
                            <p>กำลังสร้างรูปภาพ...</p>
                          </div>
                        ) : avatarPreview ? (
                           <Image src={avatarPreview} alt="Generated Avatar" width={400} height={400} className="object-cover w-full h-full" />
                        ) : (
                           <div className="text-center text-muted-foreground p-4 flex flex-col items-center justify-center">
                            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-primary/30" />
                            <p className="text-sm">รูปภาพจะแสดงที่นี่</p>
                          </div>
                        )}
                      </div>
                      <Button type="button" onClick={handleGenerateCharacter} disabled={isGeneratingCharacter || isGeneratingImage} className="w-full bg-gradient-to-r from-blue-500 to-teal-400 text-white font-bold shadow-md hover:scale-105 transition-transform">
                        {isGeneratingCharacter ? <Loader2 className="animate-spin" /> : <Wand2 />}
                        <span>AI ช่วยสร้างข้อมูล (ฟรี)</span>
                      </Button>
                      <Button type="button" onClick={handleGenerateImage} disabled={isGeneratingCharacter || isGeneratingImage} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow-md hover:scale-105 transition-transform">
                        {isGeneratingImage ? <Loader2 className="animate-spin" /> : <Sparkles />}
                        <span>AI สร้างรูปภาพ (ฟรี)</span>
                      </Button>
                  </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-8">
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                      <CardTitle>ข้อมูลพื้นฐาน</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                      <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                          <FormItem>
                              <FormLabel>ชื่อตัวละคร *</FormLabel>
                              <FormControl>
                              <Input placeholder="e.g. อัลเบิร์ต ไอน์สไตน์" {...field} maxLength={40} className="focus:ring-primary focus:border-primary transition-all duration-300"/>
                              </FormControl>
                              <FormDescription className='flex justify-end'>{field.value.length}/40</FormDescription>
                              <FormMessage />
                          </FormItem>
                          )}
                      />

                      <FormField
                          control={form.control}
                          name="tagline"
                          render={({ field }) => (
                          <FormItem>
                              <FormLabel>คำโปรย * (สำหรับแสดงผลบนหน้าตัวละคร เป็นข้อมูลให้ AI)</FormLabel>
                              <FormControl>
                              <Textarea placeholder="e.g. อัจฉริยะผู้ปฏิวัติวงการฟิสิกส์" {...field} maxLength={100} className="focus:ring-primary focus:border-primary transition-all duration-300"/>
                              </FormControl>
                              <FormDescription className='flex justify-end'>{field.value.length}/100</FormDescription>
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
                                  <Button variant="outline" className="w-full justify-start font-normal h-auto flex-wrap hover:border-primary transition-colors">
                                    {selectedTags.length > 0 ? (
                                      selectedTags.map(tag => (
                                        <Badge key={tag} variant="secondary" className="m-1 text-sm bg-primary/10 text-primary border-primary/20">
                                          {tag}
                                          <button
                                            className="ml-2 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              setSelectedTags(prev => prev.filter(t => t !== tag));
                                            }}
                                          >
                                            <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                          </button>
                                        </Badge>
                                      ))
                                    ) : (
                                      <span>เลือกแท็ก</span>
                                    )}
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-[350px] p-0">
                                <Command>
                                  <CommandInput placeholder="ค้นหาแท็ก..."/>
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
                              <FormLabel>คำอธิบาย * (ไม่แสดงผลบนหน้าตัวละคร เป็นข้อมูลให้ AI)</FormLabel>
                              <FormControl>
                              <Textarea placeholder="e.g. ฉันเป็นนักฟิสิกส์ มีบุคลิกใจดี ชอบอธิบายแนวคิดซับซ้อนให้เข้าใจง่าย ฉันมีความสนใจในวิทยาศาสตร์ จักรวาล และดนตรีคลาสสิก" {...field} rows={6} maxLength={4096} className="focus:ring-primary focus:border-primary transition-all duration-300"/>
                              </FormControl>
                              <FormDescription className='flex justify-end'>{field.value.length}/4096</FormDescription>
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
                              <Textarea placeholder="e.g. สวัสดี ฉันคืออัลเบิร์ต ถามฉันเกี่ยวกับผลงานทางวิทยาศาสตร์ของฉันได้เลย" {...field} rows={4} maxLength={2048} className="focus:ring-primary focus:border-primary transition-all duration-300"/>
                              </FormControl>
                              <FormDescription className='flex justify-end'>{field.value.length}/2048</FormDescription>
                              <FormMessage />
                          </FormItem>
                          )}
                      />

                      <FormField
                          control={form.control}
                          name="history"
                          render={({ field }) => (
                          <FormItem>
                              <FormLabel>ประวัติตัวละคร (สำหรับผู้ใช้ดูเท่านั้น ไม่ใช้เป็นข้อมูลให้ AI) (ไม่บังคับ)</FormLabel>
                              <FormControl>
                              <Textarea placeholder="e.g. อัลเบิร์ตเกิดในเยอรมนีเมื่อปี 1879 ได้รับรางวัลโนเบลจากการค้นพบปรากฏการณ์โฟโตอิเล็กทริก" {...field} rows={6} maxLength={4096} className="focus:ring-primary focus:border-primary transition-all duration-300"/>
                              </FormControl>
                              <FormDescription className='flex justify-end'>{field.value?.length || 0}/4096</FormDescription>
                              <FormMessage />
                          </FormItem>
                          )}
                      />
                  </CardContent>
              </Card>

              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                      <CardTitle>การมองเห็น *</CardTitle>
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
                                      สาธารณะ
                                  </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                      <RadioGroupItem value="private" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                      ส่วนตัว
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
           
            <div className="flex justify-end">
                <Button type="submit" size="lg" className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold shadow-lg hover:scale-105 transition-transform">
                  <Rocket className="mr-2"/>
                  สร้างตัวละคร
                </Button>
            </div>
             <p className="text-xs text-muted-foreground text-center">
                โปรดตรวจสอบให้แน่ใจว่าตัวละครเป็นไปตาม <Link href="#" className="underline hover:text-primary">ข้อกำหนดและเงื่อนไข</Link>
            </p>
        </form>
      </Form>
    </div>
  );
}
