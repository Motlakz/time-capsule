/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { deleteAccount } from '@/lib/appwrite';
import MainLoader from '@/components/MainLoader';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

const ProfilePage: React.FC = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteAccount = async () => {
    if (!user) return;
    try {
      await deleteAccount(user.userId);
      toast({
        title: "Account Deleted",
        description: "Your account has been successfully deleted.",
      });
      window.location.href = '/';
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error deleting your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return <div><MainLoader isLoading /></div>;
  }

  if (!user) {
    return <div className="text-center text-lg">Please log in to manage your profile.</div>;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto p-6 max-w-2xl bg-gray-100 rounded-lg shadow-lg"
    >
      <h1 className="text-4xl font-bold mb-4 text-center text-gray-600">Welcome, {user.name || 'User'}!</h1>
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">User Information</h2>
        <div className="mt-4 text-gray-700">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Account Created:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Personal Options</h2>
        <div className="mt-4">
          <Button className="w-full mb-2" onClick={() => alert('Edit Profile feature coming soon!')} variant="outline">
            ✏️ Edit Profile
          </Button>
          <Button className="w-full mb-2" onClick={() => alert('Change Password feature coming soon!')} variant="outline">
            🔒 Change Password
          </Button>
          <Button className="w-full mb-2" onClick={() => alert('Manage Notifications feature coming soon!')} variant="outline">
            🔔 Manage Notifications
          </Button>
        </div>
      </div>

      <Button onClick={() => setIsDeleteDialogOpen(true)} className="w-full bg-red-600 hover:bg-red-700 text-white">
        🗑️ Delete Account
      </Button>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your account? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="mr-2">
              Cancel
            </Button>
            <Button onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700 text-white">
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ProfilePage;
