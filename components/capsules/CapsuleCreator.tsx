'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FileUploader } from './FileUploader';
import { createCapsule } from '@/lib/appwrite';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Switch } from '@/components/ui/switch';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/ui/icons';
import { Badge } from '../ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const capsuleSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().optional(),
    isPrivate: z.boolean().default(true),
    scheduledReveal: z.date().min(new Date(), 'Reveal date must be in the future'),
    selfDestructDate: z.date().optional().refine(
      (date) => {
        if (!date) return true;
        return date > new Date();
      },
      'Self destruct date must be in the future'
    ),
    tags: z.array(z.string()).max(5, 'Maximum 5 tags allowed'),
});

type CapsuleFormData = z.infer<typeof capsuleSchema>;

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

export function CapsuleCreator() {
    const [files, setFiles] = useState<string>('[]');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const { user } = useAuth();

    const form = useForm<CapsuleFormData>({
        resolver: zodResolver(capsuleSchema),
        defaultValues: {
            title: '',
            description: '',
            isPrivate: true,
            scheduledReveal: undefined,
            selfDestructDate: undefined,
            tags: [],
        },
    });
    
    const onSubmit = async (data: CapsuleFormData) => {
        if (!user) {
            toast({
                variant: "destructive",
                title: "Authentication Error",
                description: "You must be logged in to create a capsule.",
            });
            return;
        }
    
        try {
            setIsSubmitting(true);
            
            // Create the capsule data without modifying the files
            const capsuleData = {
                ...data,
                userId: user.userId,
                files, // Use files directly without additional JSON.stringify
                collaborators: [],
                status: 'scheduled' as const,
                description: data.description || '',
            };
    
            const newCapsule = await createCapsule(capsuleData);
    
            toast({
                title: "Success!",
                description: "Your time capsule has been created.",
            });
    
            form.reset();
            setFiles('[]');
            router.push(`/dashboard/capsules/${newCapsule.$id}`);
            
        } catch (error) {
            console.error('Failed to create capsule:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error 
                    ? error.message 
                    : "Failed to create time capsule. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    
      // Add loading state for user
      if (!user) {
        return (
          <div className="flex items-center justify-center p-8">
            <Icons.spinner className="h-8 w-8 animate-spin" />
          </div>
        );
    }

  return (
    <motion.div
      variants={formVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-2xl mx-auto"
    >
      <Card>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:py-8 py-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="My Time Capsule" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What's this time capsule about?"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scheduledReveal"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Reveal Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <Icons.calendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

            <FormField
                control={form.control}
                name="selfDestructDate"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel>Self Destruct Date (Optional)</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant="outline"
                            className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                            )}
                            >
                            {field.value ? (
                                format(field.value, "PPP")
                            ) : (
                                <span>Pick a date</span>
                            )}
                            <Icons.calendar className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                            date < form.getValues('scheduledReveal') || 
                            date < new Date()
                            }
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    <FormDescription>
                        Choose when this capsule should be permanently deleted
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <Select
                        onValueChange={(value) => {
                        const currentTags = field.value || [];
                        if (!currentTags.includes(value)) {
                            field.onChange([...currentTags, value]);
                        }
                        }}
                    >
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Add tags" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="memories">Memories</SelectItem>
                        <SelectItem value="family">Family</SelectItem>
                        <SelectItem value="friends">Friends</SelectItem>
                        <SelectItem value="work">Work</SelectItem>
                        <SelectItem value="travel">Travel</SelectItem>
                        <SelectItem value="milestone">Milestone</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {field.value?.map((tag, index) => (
                        <Badge
                            key={index}
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() => {
                            const newTags = field.value.filter((t) => t !== tag);
                            field.onChange(newTags);
                            }}
                        >
                            {tag}
                            <Icons.x className="w-3 h-3 ml-1" />
                        </Badge>
                        ))}
                    </div>
                    <FormDescription>
                        Add tags to help organize your capsules
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />

              <FormField
                control={form.control}
                name="isPrivate"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Private Capsule
                      </FormLabel>
                      <FormDescription>
                        Only you and invited collaborators can view this capsule
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormLabel>Attachments</FormLabel>
                <FileUploader
                    onFilesUploaded={(uploadedFiles) => {
                        setFiles(typeof uploadedFiles === 'string' ? uploadedFiles : '[]');
                    }}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Time Capsule
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
