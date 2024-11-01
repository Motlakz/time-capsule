"use client";

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TimeCapsule, User } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CapsuleCard } from '@/components/capsules/CapsuleCard';
import { TimelineView } from '@/components/capsules/TimelineView';
import { CapsuleCreator } from '@/components/capsules/CapsuleCreator';
import { CapsuleEditor } from '@/components/capsules/CapsuleEditor';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Clock, Grid, List } from 'lucide-react';

interface DashboardProps {
  user: User;
  capsules: TimeCapsule[];
  onDeleteCapsule: (capsuleId: string) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 }
  }
};

export default function Dashboard({ 
  user, 
  capsules,  
  onDeleteCapsule 
}: DashboardProps) {
  const [activeMainTab, setActiveMainTab] = useState('private');
  const [activeSubTab, setActiveSubTab] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedCapsule, setSelectedCapsule] = useState<TimeCapsule | null>(null);

  const filteredCapsules = useMemo(() => {
    return capsules
      .filter(capsule => {
        // Status filter
        if (statusFilter !== 'all' && capsule.status !== statusFilter) return false;
        
        // Search filter
        const searchLower = searchTerm.toLowerCase();
        return (
          capsule.title.toLowerCase().includes(searchLower) ||
          capsule.description.toLowerCase().includes(searchLower) ||
          capsule.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'date':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'title':
            return a.title.localeCompare(b.title);
          case 'reveal':
            return new Date(a.scheduledReveal).getTime() - new Date(b.scheduledReveal).getTime();
          default:
            return 0;
        }
      });
  }, [capsules, searchTerm, statusFilter, sortBy]);

  // Separate filtered lists for private and public capsules
  const privateCapsules = filteredCapsules.filter(capsule => capsule.isPrivate);
  const publicCapsules = filteredCapsules.filter(capsule => !capsule.isPrivate);

  const capsuleStats = useMemo(() => ({
    total: capsules.length,
    private: capsules.filter(c => c.isPrivate).length,
    public: capsules.filter(c => !c.isPrivate).length,
    revealed: capsules.filter(c => c.status === 'revealed').length,
    scheduled: capsules.filter(c => c.status === 'scheduled').length,
  }), [capsules]);

  const handleEditClick = (capsule: TimeCapsule) => {
    setSelectedCapsule(capsule);
    setIsEditorOpen(true);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto p-6 max-w-7xl"
    >
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user.name || 'Time Traveler'}</h1>
          <p className="text-muted-foreground mt-1">Manage your time capsules</p>
        </div>
        <Button onClick={() => setIsCreatorOpen(true)} className="flex border dark:border-gray-700 rounded-lg items-center gap-2 mt-4 sm:mt-0">
          <Plus className="w-4 h-4" />
          Create Capsule
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {Object.entries(capsuleStats).map(([key, value]) => (
          <div key={key} className="bg-card p-4 rounded-lg shadow-sm border dark:border-gray-700">
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-sm text-muted-foreground capitalize">{key}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 border dark:border-gray-700 rounded-lg">
          <Input
            placeholder="Search capsules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] border dark:border-gray-700 rounded-lg">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="border dark:border-gray-700 rounded-lg">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="revealed">Revealed</SelectItem>
            <SelectItem value="destroyed">Destroyed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px] border dark:border-gray-700 rounded-lg">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="border dark:border-gray-700 rounded-lg">
            <SelectItem value="date">Date Created</SelectItem>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="reveal">Reveal Date</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Tabs for Private and Public */}
        <Tabs value={activeMainTab} onValueChange={setActiveMainTab}>
        <TabsList className="flex border dark:border-gray-700 rounded-lg">
            <TabsTrigger value="private" className="flex-1 flex items-center justify-center gap-2">
                Private
            </TabsTrigger>
            <TabsTrigger value="public" className="flex-1 flex items-center justify-center gap-2">
                Public
            </TabsTrigger>
        </TabsList>

        {/* Sub-Tabs for Grid and List Views */}
        <TabsContent value="private" className="mt-6">
            <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
            <TabsList className="border dark:border-gray-700 rounded-lg">
                <TabsTrigger value="grid" className="flex items-center gap-2">
                  <Grid className="w-4 h-4" />
                  Grid
                  </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <List className="w-4 h-4" />
                  List
                </TabsTrigger>
            </TabsList>

            <TabsContent value="grid" className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {privateCapsules.map((capsule) => (
                    <CapsuleCard
                      key={capsule.id}
                      capsule={capsule}
                      user={user}
                      onEdit={() => handleEditClick(capsule)}
                      onDelete={() => onDeleteCapsule(capsule.id)}
                      layoutType="grid"
                    />
                ))}
                </div>
            </TabsContent>

            <TabsContent value="list" className="my-6">
                <div className="divide-y">
                {privateCapsules.map((capsule) => (
                    <CapsuleCard
                    key={capsule.id}
                    capsule={capsule}
                        user={user}
                        onEdit={() => handleEditClick(capsule)}
                        onDelete={() => onDeleteCapsule(capsule.id)}
                        layoutType="list"
                    />
                ))}
                </div>
            </TabsContent>
            </Tabs>
            <div className="timeline p-4 my-8 flex items-center gap-4 border dark:bg-slate-950 rounded-md bg-gray-200"><Clock /> Timeline</div>
            <TimelineView capsules={privateCapsules} />
        </TabsContent>

        <TabsContent value="public" className="mt-6">
            <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
            <TabsList>
                <TabsTrigger value="grid" className="flex items-center gap-2">
                <Grid className="w-4 h-4" />
                Grid
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center gap-2">
                <List className="w-4 h-4" />
                List
                </TabsTrigger>
            </TabsList>

            <TabsContent value="grid" className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {publicCapsules.map((capsule) => (
                    <CapsuleCard
                      key={capsule.id}
                      capsule={capsule}
                      user={user}
                      onEdit={() => handleEditClick(capsule)}
                      onDelete={() => onDeleteCapsule(capsule.id)}
                      layoutType="grid"
                    />
                ))}
                </div>
            </TabsContent>

            <TabsContent value="list" className="mt-6">
                <div className="divide-y">
                {publicCapsules.map((capsule) => (
                    <CapsuleCard
                    key={capsule.id}
                    capsule={capsule}
                    user={user}
                    onEdit={() => handleEditClick(capsule)}
                    onDelete={() => onDeleteCapsule(capsule.id)}
                    layoutType="list" // Pass layout type as list
                    />
                ))}
                </div>
            </TabsContent>
            </Tabs>
        </TabsContent>
        </Tabs>

      {/* Create Dialog */}
      <Dialog open={isCreatorOpen} onOpenChange={setIsCreatorOpen}>
        <DialogContent className="max-w-2xl max-h-[600px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Time Capsule</DialogTitle>
            <DialogDescription>
              Capture your memories and schedule when to reveal them.
            </DialogDescription>
          </DialogHeader>
          <CapsuleCreator />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-2xl max-h-[600px] overflow-y-auto border dark:border-gray-700 rounded-lg">
          <DialogHeader>
            <DialogTitle>Edit Time Capsule</DialogTitle>
            <DialogDescription>
              Modify your capsule details and attachments.
            </DialogDescription>
          </DialogHeader>
          {selectedCapsule && (
            <CapsuleEditor 
                capsuleId={selectedCapsule.id}
            />
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
