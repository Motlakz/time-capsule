"use client";

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNotifications } from '@/context/NotificationContext';
import { Notification } from '@/types';
import { useRouter } from 'next/navigation';

const getNotificationIcon = (type: Notification['type']) => {
  // Add icons based on notification type
  switch (type) {
    case 'capsule_reveal':
      return '🎉';
    case 'capsule_invite':
      return '✉️';
    case 'comment':
      return '💬';
    case 'mention':
      return '@';
    case 'capsule_edit':
      return '✏️';
    case 'self_destruct_warning':
      return '⚠️';
    case 'security_alert':
      return '🔒';
    default:
      return '📢';
  }
};

export function NotificationBell() {
    const router = useRouter();
    const { notifications, unreadCount, markAsRead, loading } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
  
    const handleNotificationClick = async (notification: Notification) => {
      if (notification.status === 'unread') {
          await markAsRead(notification.id); // Ensure notification.id is valid
      }
      
      // Handle navigation based on notification type and reference
      if (notification.referenceType && notification.referenceId) {
          switch (notification.type) {
              case 'capsule_reveal':
              case 'capsule_edit':
              case 'capsule_invite':
              case 'self_destruct_warning':
                  // Navigate to the capsule page
                  router.push(`/dashboard/capsules/${notification.referenceId}`);
                  break;
              case 'comment':
                  // Navigate to the capsule with the comment section opened
                  router.push(`/dashboard/capsules/${notification.referenceId}?showComments=true`);
                  break;
              default:
                  // For any other notification types, just mark as read without navigation
                  break;
          }
      }
      
      setIsOpen(false);
  };
  
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {unreadCount}
                    </span>
                )}
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel className="flex justify-between items-center">
            Notifications
            {unreadCount > 0 && (
              <span className="text-xs text-muted-foreground">
                {unreadCount} unread
              </span>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="max-h-[300px] overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">
                <Loader2 className="h-5 w-5 animate-spin mx-auto" />
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <DropdownMenuItem
                  key={`${notification.id}-${index}`} // Ensure unique key
                  onClick={() => handleNotificationClick(notification)}
                  className={`flex items-start gap-2 p-3 ${
                    notification.status === 'unread' ? 'bg-muted/50' : ''
                  }`}
                >
                  <span className="text-lg">
                    {getNotificationIcon(notification.type)}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                No notifications
              </div>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
}
