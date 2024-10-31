"use client";

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { NotificationProvider } from '@/context/NotificationContext';
import { useAuth } from '@/hooks/useAuth';
import MainLoader from '@/components/MainLoader';
import { useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };
  const router = useRouter();
  const { user, loading } = useAuth();

  if (loading) {
    return <div><MainLoader isLoading /></div>;
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <NotificationProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar onToggleSidebar={toggleSidebar} />
        <div className="flex-1 flex">
          <Sidebar isOpen={isSidebarOpen} />
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-1 container mx-auto px-4 py-8"
          >
            {children}
          </motion.main>
        </div>
      </div>
    </NotificationProvider>
  );
}
