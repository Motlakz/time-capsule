"use client"

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TimeCapsule, User } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CapsuleCard } from '@/components/capsules/CapsuleCard';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Users, Heart, Clock, Lock, UserPlus, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FriendsPageProps {
  currentUser: User;
  allUsers?: User[];
  allCapsules?: TimeCapsule[];
}

// Mock existing friends data
const mockFriends: User[] = [
  {
    id: '2',
    userId: '2',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
    is2FAEnabled: false,
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    userId: '3',
    name: 'Bob Smith',
    email: 'bob@example.com',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
    is2FAEnabled: false,
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    userId: '4',
    name: 'Carol White',
    email: 'carol@example.com',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carol',
    is2FAEnabled: false,
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '5',
    userId: '5',
    name: 'David Brown',
    email: 'david@example.com',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
    is2FAEnabled: false,
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '6',
    userId: '6',
    name: 'Eve Davis',
    email: 'eve@example.com',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=eve',
    is2FAEnabled: false,
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Mock potential friends data
const potentialFriends: User[] = [
  {
    id: '7',
    userId: '7',
    name: 'Frank Wilson',
    email: 'frank@example.com',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=frank',
    role: 'user',
    is2FAEnabled: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '8',
    userId: '8',
    name: 'Grace Lee',
    email: 'grace@example.com',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=grace',
    role: 'user',
    is2FAEnabled: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '9',
    userId: '9',
    name: 'Henry Martinez',
    email: 'henry@example.com',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=henry',
    role: 'user',
    is2FAEnabled: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

interface FriendRequestDialog {
  isOpen: boolean;
  selectedUser: User | null;
}

const FriendsPage = ({ 
    currentUser = { 
        id: '', 
        userId: '', 
        name: '', 
        email: '', 
        image: '', 
        is2FAEnabled: false, 
        role: 'user', 
        createdAt: new Date(), 
        updatedAt: new Date() 
    },
    allUsers = mockFriends,
    allCapsules = [] 
  }: FriendsPageProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFriend, setSelectedFriend] = useState<User | null>(null);
    const [activeTab, setActiveTab] = useState('friends');
    const [requestDialog, setRequestDialog] = useState<FriendRequestDialog>({
      isOpen: false,
      selectedUser: null
    });
    const [requestMessage, setRequestMessage] = useState('');
    const [pendingRequests, setPendingRequests] = useState<string[]>([]);
    
    const filteredFriends = useMemo(() => {
      const searchLower = searchTerm.toLowerCase();
      return allUsers.filter(user => {
        if (!user || !currentUser) return false; // Check if currentUser is defined
        return user.userId !== currentUser.userId && 
               (user.name.toLowerCase().includes(searchLower) ||
                user.email.toLowerCase().includes(searchLower));
      });
    }, [allUsers, currentUser, searchTerm]);
  
    const filteredPotentialFriends = useMemo(() => {
      const searchLower = searchTerm.toLowerCase();
      return potentialFriends.filter(user => 
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }, [searchTerm]);
  
    const friendCapsules = useMemo(() => {
      if (!selectedFriend || !allCapsules) return [];
      return allCapsules.filter(capsule => 
        capsule.userId === selectedFriend.userId ||
        capsule.collaborators?.includes(selectedFriend.userId)
      );
    }, [selectedFriend, allCapsules]);

    const getFriendStats = (userId: string) => {
        if (!allCapsules) return { totalCapsules: 0, collaborations: 0, scheduledCapsules: 0 };
    
        const userCapsules = allCapsules.filter(capsule => 
            capsule.userId === userId ||
            capsule.collaborators?.includes(userId)
        );
    
        return {
            totalCapsules: userCapsules.length,
            collaborations: userCapsules.filter(c => c.collaborators?.includes(userId)).length,
            scheduledCapsules: userCapsules.filter(c => c.status === 'scheduled').length
        };
    };
  
    const handleSendRequest = (user: User) => {
      setPendingRequests([...pendingRequests, user.userId]);
      setRequestDialog({ isOpen: false, selectedUser: null });
      setRequestMessage('');
    };
  
    return (
      <div className="container mx-auto p-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="max-w-lg w-full">
            <Card className="border border-gray-700">
              <CardContent className="p-4">
                <Tabs defaultValue="friends" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2 border border-gray-700">
                    <TabsTrigger value="friends">
                      <Users className="w-4 h-4 mr-2" />
                      Friends
                    </TabsTrigger>
                    <TabsTrigger value="discover">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Discover
                    </TabsTrigger>
                  </TabsList>
  
                  <div className="relative my-4 border border-gray-700 rounded-lg">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
  
                  <TabsContent value="friends" className="space-y-2">
                    {filteredFriends.map((friend) => {
                      const stats = getFriendStats(friend.userId);
                      return (
                        <Button
                          key={friend.userId}
                          variant={selectedFriend?.userId === friend.userId ? "secondary" : "ghost"}
                          className="w-full justify-start p-2 h-auto border border-gray-700 rounded-lg"
                          onClick={() => setSelectedFriend(friend)}
                        >
                          <div className="flex items-center gap-3 w-full">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={friend.image} alt={friend.name} />
                              <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 text-left">
                              <div className="font-medium">{friend.name}</div>
                              <div className="text-xs text-muted-foreground">
                                    {stats.totalCapsules} capsules
                                </div>
                            </div>
                          </div>
                        </Button>
                      );
                    })}
                  </TabsContent>
  
                  <TabsContent value="discover" className="space-y-2 border border-gray-700 rounded-lg p-4">
                    {filteredPotentialFriends.map((user) => (
                      <div
                        key={user.userId}
                        className="flex items-center justify-between p-2 hover:bg-secondary border border-gray-700 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.image} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                        <Dialog 
                          open={requestDialog.isOpen && requestDialog.selectedUser?.userId === user.userId}
                          onOpenChange={(open) => setRequestDialog({ isOpen: open, selectedUser: open ? user : null })}
                        >
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant={pendingRequests.includes(user.userId) ? "secondary" : "default"}
                              disabled={pendingRequests.includes(user.userId)}
                            >
                              {pendingRequests.includes(user.userId) ? (
                                "Request Sent"
                              ) : (
                                <>
                                  <UserPlus className="w-4 h-4 mr-2" />
                                  Add Friend
                                </>
                              )}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="border border-gray-700 rounded-lg">
                            <DialogHeader>
                              <DialogTitle>Send Friend Request</DialogTitle>
                              <DialogDescription>
                                Add a message to your friend request to {user.name}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <Textarea
                                placeholder="Write a message... (optional)"
                                value={requestMessage}
                                onChange={(e) => setRequestMessage(e.target.value)}
                                className="min-h-[100px]"
                              />
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => setRequestDialog({ isOpen: false, selectedUser: null })}
                                >
                                  Cancel
                                </Button>
                                <Button onClick={() => handleSendRequest(user)}>
                                  Send Request
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
  
          <div className="max-w-lg w-full border border-gray-700 rounded-lg">
            {selectedFriend ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="mb-6">
                  <CardContent className="p-6 ">
                    <div className="flex items-center gap-4 mb-4 border border-gray-700 rounded-lg p-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={selectedFriend.image} alt={selectedFriend.name} />
                        <AvatarFallback>{selectedFriend.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-2xl font-bold">{selectedFriend.name}</h2>
                        <p className="text-muted-foreground">Member since {new Date(selectedFriend.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="flex items-center flex-col text-center gap-2 p-2 border border-gray-700 rounded-lg">
                        <Lock className="w-4 h-4 text-primary" />
                        <div>
                          <div className="font-medium">{getFriendStats(selectedFriend.userId).totalCapsules}</div>
                          <div className="text-sm text-muted-foreground">Capsules</div>
                        </div>
                      </div>
                      <div className="flex items-center flex-col text-center gap-2 p-2 border border-gray-700 rounded-lg">
                        <Heart className="w-4 h-4 text-primary" />
                        <div>
                          <div className="font-medium">{getFriendStats(selectedFriend.userId).collaborations}</div>
                          <div className="text-sm text-muted-foreground">Collaborations</div>
                        </div>
                      </div>
                      <div className="flex items-center flex-col text-center gap-2 p-2 border border-gray-700 rounded-lg">
                        <Clock className="w-4 h-4 text-primary" />
                        <div>
                          <div className="font-medium">{getFriendStats(selectedFriend.userId).scheduledCapsules}</div>
                          <div className="text-sm text-muted-foreground">Scheduled</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
  
                <div className="space-y-6">
                  {friendCapsules.length > 0 ? (
                    friendCapsules.map((capsule) => (
                      <CapsuleCard
                        key={capsule.id}
                        capsule={capsule}
                        user={currentUser}
                        layoutType="grid"
                      />
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      No capsules found
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[50vh] text-center text-muted-foreground">
                <Users className="w-12 h-12 mb-4" />
                <h3 className="text-lg font-medium">Select a friend to view their profile</h3>
                <p>Choose from your friends list to see their capsules and activities</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
};
  
export default FriendsPage;
  