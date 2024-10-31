import { useState, useEffect } from 'react';
import { account } from '@/lib/appwrite';
import { User } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await account.get();
        const userDetails = await account.get();

        // Map Appwrite user details to your User type
        const customUser: User = {
          id: session.$id, 
          userId: session.$id,
          email: userDetails.email,
          name: userDetails.name || '',
          image: userDetails.prefs?.avatar || '',
          is2FAEnabled: false,
          role: 'user',
          createdAt: new Date(), 
          updatedAt: new Date(), 
        };

        setUser(customUser);
      } catch (error) {
        console.error('Error fetching user session:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  return { user, loading };
}
