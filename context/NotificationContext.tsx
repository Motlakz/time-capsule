"use client";

import { createContext, useContext, useEffect, useCallback, useState } from 'react';
import { Notification, NotificationType } from '@/types';
import { client } from '@/lib/appwrite';
import { useAuth } from '@/hooks/useAuth';
import { 
  createNotification as createNotificationAPI,
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification as deleteNotificationAPI
} from '@/lib/appwrite';
import { Models } from 'appwrite';
import { useToast } from '@/hooks/use-toast';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  createNotification: (
    type: NotificationType,
    title: string,
    message: string,
    referenceId?: string,
    referenceType?: 'capsule' | 'comment' | 'user'
  ) => Promise<void>;
  loading: boolean;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  markAsRead: async () => {},
  deleteNotification: async () => {},
  createNotification: async () => {},
  loading: false,
});

interface AppwriteRealtimeMessage {
  events: string[];
  payload: Models.Document;
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await getUserNotifications(user.userId);
      setNotifications(response.documents as unknown as Notification[]);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: "Error",
        description: "Failed to fetch notifications.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const handleCreateNotification = async (
    type: NotificationType,
    title: string,
    message: string,
    referenceId?: string,
    referenceType?: 'capsule' | 'comment' | 'user'
) => {
    if (!user) return;

    try {
        const newNotification = await createNotificationAPI(
            user.userId,
            type,
            title,
            message,
            referenceId,
            referenceType
        );
        console.log('Created notification:', newNotification);
        await fetchNotifications();
    } catch (error) {
        console.error('Error creating notification:', error);
        toast({
            title: "Error",
            description: "Failed to create notification.",
            variant: "destructive",
        });
    }
};;

  const handleMarkAsRead = async (notificationId: string) => {
    if (!notificationId) {
        console.error('Notification ID is required to mark as read');
        return;
    }
    
    console.log(`Marking notification as read: ${notificationId}`);
    
    try {
        const response = await markNotificationAsRead(notificationId);
        console.log('Response from markNotificationAsRead:', response);
        
        setNotifications(prev =>
            prev.map(n =>
                n.id === notificationId
                    ? { ...n, status: 'read', readAt: new Date() }
                    : n
            )
        );
    } catch (error) {
        console.error('Error marking notification as read:', error);
        toast({
            title: "Error",
            description: "Failed to mark notification as read.",
            variant: "destructive",
        });
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await deleteNotificationAPI(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast({
        title: "Error",
        description: "Failed to delete notification.",
        variant: "destructive",
      });
    }
  };

  // Set up real-time updates
  useEffect(() => {
    if (!user) return;

    const unsubscribe = client.subscribe(
      `databases.*.collections.*.documents`,
      (response: AppwriteRealtimeMessage) => {
        const { events, payload } = response;

        // Only process notifications for the current user
        if (payload.userId !== user.userId) return;

        if (events.includes('databases.*.collections.*.documents.*.create')) {
          setNotifications(prev => [payload as unknown as Notification, ...prev]);
        }
        
        if (events.includes('databases.*.collections.*.documents.*.update')) {
          setNotifications(prev => 
            prev.map(n => n.id === payload.$id ? payload as unknown as Notification : n)
          );
        }
        
        if (events.includes('databases.*.collections.*.documents.*.delete')) {
          setNotifications(prev => prev.filter(n => n.id !== payload.$id));
        }
      }
    );

    fetchNotifications();

    return () => {
      unsubscribe();
    };
  }, [user, fetchNotifications]);

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead: handleMarkAsRead,
        deleteNotification: handleDeleteNotification,
        createNotification: handleCreateNotification,
        loading,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
