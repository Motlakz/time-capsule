"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Menu } from 'lucide-react';
import { account } from '@/lib/appwrite';
import { NotificationBell } from './notifications/NotificationsBell';

interface NavbarProps {
  onToggleSidebar: () => void;
}
export function Navbar({ onToggleSidebar }: NavbarProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await account.deleteSession('current');
      router.push('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <nav className="px-4 sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
            <Menu className="h-5 w-5" />
          </Button>
          <Link href="/dashboard" className="font-bold text-xl">
            Memory Fort
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <NotificationBell />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
