"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Home,
  Clock,
  Users,
  Settings,
} from 'lucide-react';

const sidebarLinks = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/dashboard/feed', icon: Clock, label: 'Feed' },
  { href: '/dashboard/friends', icon: Users, label: 'Friends' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

interface SidebarProps {
  isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={`fixed md:relative w-56 border-r h-full z-50 bg-background flex-col p-4 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
      <nav className="space-y-2">
        {sidebarLinks.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
              pathname === href
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
