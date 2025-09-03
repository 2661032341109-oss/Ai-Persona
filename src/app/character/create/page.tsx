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
    message: 'Name must be at least 2 characters.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  personality: z.string().min(10, {
    message: 'Personality must be at least 10 characters.',
  }),
  background: z.string().min(10, {
    message: 'Background must be at least 10 characters.',
  }),
  greeting: z.string().min(5, {
    message: 'Greeting must be at least 5 characters.',
  }),
  avatarUrl: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
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
      title: 'Character Created!',
      description: `${values.name} has joined the roster.`,
    });
    router.push('/');
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
        <Button variant="ghost" asChild className="mb-4">
            <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Characters
            </Link>
        </Button>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Create a New Character</CardTitle>
          <CardDescription>
            Bring your own companion to life. Define their identity, story, and how they greet the world.
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
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Anya the Starlight Mage" {...field} />
                    </FormControl>
                    <FormDescription>The character's full name or title.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="A brief, one-sentence summary of the character." {...field} />
                    </FormControl>
                    <FormDescription>This appears on the character card.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="personality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Personality</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe their traits, quirks, and mannerisms." {...field} rows={4} />
                    </FormControl>
                     <FormDescription>How do they behave and interact?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="background"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Background</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tell their story. Where are they from? What events shaped them?" {...field} rows={6}/>
                    </FormControl>
                    <FormDescription>The character's history and lore.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="greeting"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Greeting</FormLabel>
                    <FormControl>
                      <Textarea placeholder="How does the character first introduce themselves?" {...field} rows={3}/>
                    </FormControl>
                    <FormDescription>The first message they will send in a new chat.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="avatarUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avatar URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.png" {...field} />
                    </FormControl>
                    <FormDescription>
                      Link to an image for the character's portrait. Leave blank for a random image.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <CardFooter className="px-0 pt-6">
                <Button type="submit">Create Character</Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
