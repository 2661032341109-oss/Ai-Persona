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
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร',
  }),
  description: z.string().min(10, {
    message: 'คำอธิบายต้องมีอย่างน้อย 10 ตัวอักษร',
  }),
  personality: z.string().min(10, {
    message: 'บุคลิกภาพต้องมีอย่างน้อย 10 ตัวอักษร',
  }),
  background: z.string().min(10, {
    message: 'พื้นหลังต้องมีอย่างน้อย 10 ตัวอักษร',
  }),
  greeting: z.string().min(5, {
    message: 'คำทักทายต้องมีอย่างน้อย 5 ตัวอักษร',
  }),
  avatarUrl: z.string().url({ message: 'กรุณาใส่ URL ที่ถูกต้อง' }).optional().or(z.literal('')),
});

export default function CreateCharacterPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      personality: '',
      background: '',
      greeting: '',
      avatarUrl: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newCharacter = {
        ...values,
        avatarUrl: values.avatarUrl || `https://picsum.photos/400/400?random=${Date.now()}`
    }
    addCharacter(newCharacter);
    
    toast({
      title: 'สร้างตัวละครแล้ว!',
      description: `${values.name} ได้เข้าร่วมบัญชีรายชื่อแล้ว`,
    });
    router.push('/');
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
        <Button variant="ghost" asChild className="mb-4">
            <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                กลับไปที่ตัวละคร
            </Link>
        </Button>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">สร้างตัวละครใหม่</CardTitle>
          <CardDescription>
            ทำให้เพื่อนคู่ใจของคุณมีชีวิตขึ้นมา กำหนดตัวตน เรื่องราว และวิธีที่พวกเขาทักทายโลก
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ชื่อ</FormLabel>
                    <FormControl>
                      <Input placeholder="เช่น อันยา จอมเวทย์แห่งแสงดาว" {...field} />
                    </FormControl>
                    <FormDescription>ชื่อเต็มหรือตำแหน่งของตัวละคร</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>คำอธิบายสั้น ๆ</FormLabel>
                    <FormControl>
                      <Textarea placeholder="สรุปสั้น ๆ หนึ่งประโยคเกี่ยวกับตัวละคร" {...field} />
                    </FormControl>
                    <FormDescription>ข้อความนี้จะปรากฏบนการ์ดตัวละคร</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="personality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>บุคลิกภาพ</FormLabel>
                    <FormControl>
                      <Textarea placeholder="อธิบายลักษณะนิสัย ลักษณะเฉพาะ และท่าทางของพวกเขา" {...field} rows={4} />
                    </FormControl>
                     <FormDescription>พวกเขาประพฤติตนและมีปฏิสัมพันธ์อย่างไร?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="background"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>พื้นหลัง</FormLabel>
                    <FormControl>
                      <Textarea placeholder="เล่าเรื่องราวของพวกเขา พวกเขามาจากไหน? เหตุการณ์ใดที่หล่อหลอมพวกเขา?" {...field} rows={6}/>
                    </FormControl>
                    <FormDescription>ประวัติและเรื่องราวของตัวละคร</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="greeting"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>คำทักทาย</FormLabel>
                    <FormControl>
                      <Textarea placeholder="ตัวละครแนะนำตัวเองครั้งแรกอย่างไร?" {...field} rows={3}/>
                    </FormControl>
                    <FormDescription>ข้อความแรกที่พวกเขาจะส่งในการแชทใหม่</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="avatarUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL รูปประจำตัว</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.png" {...field} />
                    </FormControl>
                    <FormDescription>
                      ลิงก์ไปยังรูปภาพสำหรับภาพเหมือนของตัวละคร เว้นว่างไว้สำหรับรูปภาพแบบสุ่ม
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <CardFooter className="px-0 pt-6">
                <Button type="submit">สร้างตัวละคร</Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
