"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Icons } from '@/components/ui/icons';
import { CapsuleCard } from '@/components/capsules/CapsuleCard';
import { TimeCapsule } from '@/types';
import { getCapsule } from '@/lib/appwrite';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function CapsulePage({ params }: { params: { id: string } }) {
  const { user, loading } = useAuth();
  const [capsule, setCapsule] = useState<TimeCapsule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchCapsule = async () => {
      try {
        const fetchedCapsule = await getCapsule(params.id);
        
        // Map the fetched document to TimeCapsule type
        const mappedCapsule: TimeCapsule = {
          id: fetchedCapsule.$id,
          userId: fetchedCapsule.userId,
          title: fetchedCapsule.title,
          description: fetchedCapsule.description,
          isPrivate: fetchedCapsule.isPrivate,
          scheduledReveal: new Date(fetchedCapsule.scheduledReveal),
          selfDestructDate: fetchedCapsule.selfDestructDate ? new Date(fetchedCapsule.selfDestructDate) : undefined,
          tags: fetchedCapsule.tags,
          collaborators: fetchedCapsule.collaborators || [],
          files: fetchedCapsule.files || '[]',
          status: fetchedCapsule.status,
          createdAt: new Date(fetchedCapsule.createdAt),
          updatedAt: new Date(fetchedCapsule.updatedAt),
          originalMockId: fetchedCapsule.originalMockId,
          referenceId: fetchedCapsule.referenceId
        };

        setCapsule(mappedCapsule);
      } catch (error) {
        console.error('Failed to fetch capsule:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load capsule data.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchCapsule();
    }
  }, [params.id, toast]);

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <p>Please sign in to view this capsule.</p>
      </div>
    );
  }

  if (!capsule) {
    return (
      <div className="container mx-auto p-4">
        <p>Capsule not found.</p>
      </div>
    );
  }

  const handleEdit = () => {
    router.push(`/dashboard/capsules/${params.id}/edit`);
  };

  const handleDelete = async () => {
    // Implement delete functionality
    if (window.confirm('Are you sure you want to delete this capsule?')) {
      try {
        // await deleteCapsule(params.id);
        toast({
          title: "Success",
          description: "Capsule deleted successfully.",
        });
        router.push('/dashboard/capsules');
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete capsule.",
        });
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <CapsuleCard
        capsule={capsule}
        user={user}
        onEdit={handleEdit}
        onDelete={handleDelete}
        layoutType="list"
      />
    </div>
  );
}
