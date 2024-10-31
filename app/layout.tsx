import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '@/providers/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import { QueryProvider } from '@/providers/QueryProvider';
import { Footer } from "@/components/Footer";

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
});

export const metadata: Metadata = {
  title: 'Memory Fort - Time Capsule Social Platform',
  description: 'Create and share digital time capsules with your future self and loved ones.',
  keywords: [
    'time capsule',
    'digital memories',
    'social platform',
    'future messages',
    'personal archive'
  ],
  authors: [
    {
      name: 'Memory Fort Team',
    }
  ],
  creator: 'Memory Fort',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://memoryfort.com',
    title: 'Memory Fort - Time Capsule Social Platform',
    description: 'Create and share digital time capsules with your future self and loved ones.',
    siteName: 'Memory Fort',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Memory Fort - Time Capsule Social Platform',
    description: 'Create and share digital time capsules with your future self and loved ones.',
    creator: '@memoryfort',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={quicksand.variable}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <main className="font-sans min-h-screen bg-background">
              {children}
            </main>
            <Footer />
            <Toaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
