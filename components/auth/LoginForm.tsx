/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

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
type AuthMethod = 'password' | 'magic-link' | 'email-otp';

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<AuthMethod>('password');
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
      return session;
    } catch (error) {
      return null;
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      
      const session = await checkActiveSession();
  
      if (session) {
        router.push('/dashboard');
        return;
      }
  
      let user;
      const redirectUrl = "https://memoryfort.com/dashboard";
      
      switch (authMethod) {
        case 'magic-link':
          console.log("Sending magic link to:", data.email);
          await sendMagicLink(data.email, redirectUrl);
          break;
        case 'email-otp':
          console.log("Sending email OTP to:", data.email);
          await sendEmailOTP(data.email);
          break;
        default:
          console.log("Signing in with email and password");
          user = await signInAccount(data.email, data.password);
          if (user) {
            console.log("User logged in:", user);
            router.push(user.role === 'admin' ? '/admin-dashboard' : '/dashboard');
          }
      }
    } catch (error) {
      console.error("Login error:", error);
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
              {authMethod === 'password' && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter Password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <div className="flex gap-4 justify-evenly">
                <Button
                  type="button"
                  className="w-full"
                  variant={authMethod === 'password' ? 'default' : 'outline'}
                  onClick={() => setAuthMethod('password')}
                >
                  Password Login
                </Button>
                <Button
                  type="button"
                  className="w-full"
                  variant={authMethod === 'magic-link' ? 'default' : 'outline'}
                  onClick={() => setAuthMethod('magic-link')}
                >
                  Magic Link
                </Button>
                <Button
                  type="button"
                  className="w-full"
                  variant={authMethod === 'email-otp' ? 'default' : 'outline'}
                  onClick={() => setAuthMethod('email-otp')}
                >
                  Email OTP
                </Button>
              </div>
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                {authMethod === 'password' ? 'Sign In' : 'Send Link/OTP'}
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
