'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signInAccount, sendMagicLink, sendEmailOTP, account } from '@/lib/appwrite';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Icons } from '../ui/icons';
import { Button } from '../ui/button';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isMagicLink, setIsMagicLink] = useState(false);
  const [isEmailOTP, setIsEmailOTP] = useState(false);
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const checkActiveSession = async () => {
    try {
      const session = await account.getSession('current');
      return session; // Return session if it exists
    } catch (error) {
      return null;
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log("Form submitted with data:", data); // Log submitted data
      setIsLoading(true);
      
      // Check if a session is already active
      const session = await checkActiveSession();
      console.log("Active session:", session); // Log session status
  
      if (session) {
        // If a session is active, redirect to the dashboard
        console.log("Redirecting to dashboard due to active session");
        router.push('/dashboard');
        return;
      }
  
      let user;
      let redirectUrl = "https://memoryfort.com/dashboard";
      if (isMagicLink) {
        console.log("Sending magic link to:", data.email);
        await sendMagicLink(data.email, redirectUrl);
      } else if (isEmailOTP) {
        console.log("Sending email OTP to:", data.email);
        await sendEmailOTP(data.email);
      } else {
        console.log("Signing in with email and password");
        user = await signInAccount(data.email, data.password);
      }
  
      // Redirect based on user role
      if (user) {
        console.log("User logged in:", user);
        if (user.role === 'admin') {
          router.push('/admin-dashboard');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (error) {
      console.error("Login error:", error); // Log any errors
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div className="w-full max-w-md mx-auto mt-24">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">Enter your email and password to sign in</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!isMagicLink && !isEmailOTP && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <div className="flex justify-between">
                <Button type="button" onClick={() => setIsMagicLink(!isMagicLink)}>
                  {isMagicLink ? 'Use Password' : 'Use Magic Link'}
                </Button>
                <Button type="button" onClick={() => setIsEmailOTP(!isEmailOTP)}>
                  {isEmailOTP ? 'Use Password' : 'Use Email OTP'}
                </Button>
              </div>
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                {isMagicLink || isEmailOTP ? 'Send Link/OTP' : 'Sign In'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            <Link href="/reset-password" className="hover:text-primary underline underline-offset-4">
              Forgot your password?
            </Link>
          </div>
          <div className="text-sm text-center text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="hover:text-primary underline underline-offset-4">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
