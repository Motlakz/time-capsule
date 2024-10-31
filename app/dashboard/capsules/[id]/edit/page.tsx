'use client';

import { CapsuleEditor } from '@/components/capsules/CapsuleEditor'
import { useParams, useRouter } from 'next/navigation'
import { Icons } from '@/components/ui/icons';
import { useEffect, useState } from 'react';
import { getCapsule } from '@/lib/appwrite';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const EditPage = () => {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const capsuleId = params.capsuleId as string;

    useEffect(() => {
        const checkAuthorization = async () => {
            if (!user) {
                router.push('/login');
                return;
            }

            try {
                const capsule = await getCapsule(capsuleId);
                if (capsule.userId !== user.userId) {
                    toast({
                        variant: "destructive",
                        title: "Unauthorized",
                        description: "You don't have permission to edit this capsule.",
                    });
                    router.push('/dashboard');
                    return;
                }
                setIsAuthorized(true);
            } catch (error) {
                console.error('Failed to fetch capsule:', error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to load capsule data.",
                });
                router.push('/dashboard');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthorization();
    }, [capsuleId, user, router, toast]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Icons.spinner className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!isAuthorized) {
        return null;
    }

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Edit Time Capsule</h1>
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                >
                    <Icons.arrowLeft className="w-4 h-4 mr-1" />
                    Back
                </button>
            </div>
            <CapsuleEditor capsuleId={capsuleId} />
        </div>
    );
}

export default EditPage;
