"use client";

import { useEffect, useState } from 'react';
import Dashboard from '@/components/Dashboard';
import { User, TimeCapsule } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUser, getUserCapsules, deleteCapsule } from '@/lib/appwrite';
import MainLoader from '@/components/MainLoader';
import { seedDatabase } from '@/utils/seedDatabase';

export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [capsules, setCapsules] = useState<TimeCapsule[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const initializeDatabase = async () => {
            try {
                const wasSeeded = await seedDatabase();
                if (wasSeeded) {
                    console.log('Database seeded successfully');
                } else {
                    console.log('Database was already seeded, skipping...');
                }
            } catch (error) {
                console.error('Failed to seed database:', error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to seed database.",
                });
            }
        };

        const loadData = async () => {
            try {
                // Fetch user data
                const fetchedUser = await getCurrentUser();
                if (!fetchedUser) {
                    throw new Error('User not found');
                }
                setUser(fetchedUser as User); // Ensure fetchedUser is treated as User type

                // Fetch user's capsules
                const response = await getUserCapsules(fetchedUser.userId);
                const fetchedCapsules: TimeCapsule[] = response.documents.map(doc => ({
                    id: doc.$id,
                    userId: doc.userId,
                    originalMockId: doc.$id,
                    title: doc.title,
                    description: doc.description,
                    isPrivate: doc.isPrivate,
                    scheduledReveal: new Date(doc.scheduledReveal),
                    tags: doc.tags || [],
                    collaborators: doc.collaborators || [],
                    files: doc.files || [],
                    status: doc.status,
                    createdAt: new Date(doc.createdAt),
                    updatedAt: new Date(doc.updatedAt),
                    referenceId: doc.referenceId
                }));
                setCapsules(fetchedCapsules);
            } catch (error) {
                console.error('Failed to load data:', error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to load user or capsule data.",
                });
            } finally {
                setLoading(false);
            }
        };

        // Initialize the database and then load data
        initializeDatabase().then(loadData);
    }, [toast]);

    const handleDeleteCapsule = async (id: string) => {
        try {
            await deleteCapsule(id); // Use the deleteCapsule function from Appwrite
            setCapsules(prev => prev.filter(capsule => capsule.id !== id)); // Update local state
            toast({
                title: "Success!",
                description: "Capsule deleted successfully.",
            });
        } catch (error) {
            console.error('Failed to delete capsule:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to delete capsule.",
            });
        }
    };

    if (loading) {
        return <div><MainLoader isLoading={loading} /></div>;
    }

    if (!user) {
        return <div>No user found.</div>;
    }

    return (
        <Dashboard
            user={user}
            capsules={capsules}
            onDeleteCapsule={handleDeleteCapsule}
        />
    );
}
