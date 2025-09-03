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
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { addCharacter } from '@/lib/characters';
import { ArrowLeft, PlusCircle, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Image from 'next/image';

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
});

export default function CreateCharacterPage() {
  const router = useRouter();
  const { toast } = useToast();

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
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newCharacter = {
        name: values.name,
        description: values.tagline, // Using tagline for description for now
        personality: values.description, // Using description for personality
        background: values.history || '',
        greeting: values.greeting,
        avatarUrl: `https://picsum.photos/400/400?random=${Date.now()}`
    }
    addCharacter(newCharacter);
    
    toast({
      title: 'สร้างตัวละครแล้ว!',
      description: `${values.name} ได้ถูกสร้างขึ้นแล้ว`,
    });
    router.push('/');
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">สร้างตัวละคร</h1>
        <div className="flex gap-2">
            <Button variant="ghost">ยกเลิก</Button>
            <Button variant="outline">บันทึกแบบร่าง</Button>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>รูปโปรไฟล์</CardTitle>
                    <CardDescription>
                        <Link href="#" className="text-primary underline">ข้อกำหนดการสร้างตัวละคร</Link>
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 text-center">
                        <UploadCloud className="w-12 h-12 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">คลิกเพื่ออัพโหลด</p>
                    </div>
                    <div className="space-y-2">
                        <Button type="button" variant="outline" className="w-full">AI ช่วยสร้างตัวละคร (ฟรี)</Button>
                        <Button type="button" variant="outline" className="w-full">AI สร้างรูปภาพ (ฟรี)</Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
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
                            <Input placeholder="e.g. อัลเบิร์ต ไอน์สไตน์" {...field} maxLength={40} />
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
                            <Textarea placeholder="e.g. อัจฉริยะผู้ปฏิวัติวงการฟิสิกส์" {...field} maxLength={100} />
                            </FormControl>
                             <FormDescription className='flex justify-end'>{field.value.length}/100</FormDescription>
                            <FormMessage />
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
                            <Textarea placeholder="e.g. ฉันเป็นนักฟิสิกส์ มีบุคลิกใจดี ชอบอธิบายแนวคิดซับซ้อนให้เข้าใจง่าย ฉันมีความสนใจในวิทยาศาสตร์ จักรวาล และดนตรีคลาสสิก" {...field} rows={6} maxLength={4096}/>
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
                            <Textarea placeholder="e.g. สวัสดี ฉันคืออัลเบิร์ต ถามฉันเกี่ยวกับผลงานทางวิทยาศาสตร์ของฉันได้เลย" {...field} rows={4} maxLength={2048}/>
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
                            <Textarea placeholder="e.g. อัลเบิร์ตเกิดในเยอรมนีเมื่อปี 1879 ได้รับรางวัลโนเบลจากการค้นพบปรากฏการณ์โฟโตอิเล็กทริก" {...field} rows={6} maxLength={4096}/>
                            </FormControl>
                             <FormDescription className='flex justify-end'>{field.value?.length || 0}/4096</FormDescription>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </CardContent>
            </Card>

            <Card>
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
                            </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </CardContent>
            </Card>
           
            <div className="flex justify-end">
                <Button type="submit">สร้างตัวละคร</Button>
            </div>
             <p className="text-xs text-muted-foreground text-center">
                โปรดตรวจสอบให้แน่ใจว่าตัวละครเป็นไปตาม <Link href="#" className="underline">ข้อกำหนดและเงื่อนไข</Link>
            </p>
        </form>
      </Form>
    </div>
  );
}
