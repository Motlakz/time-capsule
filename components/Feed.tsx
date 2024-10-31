"use client";

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TimeCapsule, User } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CapsuleCard } from '@/components/capsules/CapsuleCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, TrendingUp, Hash } from 'lucide-react';
import MainLoader from './MainLoader';

interface FeedProps {
  user: User;
  publicCapsules?: TimeCapsule[]; 
  trendingTags?: { tag: string; count: number }[]; 
  trendingCapsules?: TimeCapsule[]; 
}

export default function Feed({
  user,
  publicCapsules = [], 
  trendingTags = [], 
  trendingCapsules = [], 
}: FeedProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('latest');

  const filteredCapsules = useMemo(() => {
    return publicCapsules.filter(capsule => {
      const searchLower = searchTerm.toLowerCase();
      return (
        capsule.title.toLowerCase().includes(searchLower) ||
        capsule.description.toLowerCase().includes(searchLower) ||
        capsule.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    });
  }, [publicCapsules, searchTerm]);

  const sortedCapsules = useMemo(() => {
    if (!filteredCapsules.length) return [];

    if (activeTab === 'latest') {
      return [...filteredCapsules].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    return [...filteredCapsules].sort(
      (a, b) => (b.collaborators?.length || 0) - (a.collaborators?.length || 0)
    );
  }, [filteredCapsules, activeTab]);

  // Loading state
  const isLoading = !publicCapsules.length && !trendingTags.length && !trendingCapsules.length;

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 max-w-7xl">
        <div className="flex justify-center items-center h-[50vh]">
          <div className="animate-pulse text-muted-foreground"><MainLoader isLoading /></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1">
          {/* Search Bar */}
          <div className="relative mb-6 border border-gray-700 rounded-lg">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search capsules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Feed Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 border border-gray-700 rounded-lg">
              <TabsTrigger value="latest">Latest</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
            </TabsList>

            <TabsContent value="latest">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {sortedCapsules.length > 0 ? (
                  sortedCapsules.map((capsule) => (
                    <CapsuleCard
                      key={capsule.id}
                      capsule={capsule}
                      user={user}
                      layoutType="grid"
                    />
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    No capsules found
                  </div>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="popular">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {sortedCapsules.length > 0 ? (
                  sortedCapsules.map((capsule) => (
                    <CapsuleCard
                      key={capsule.id}
                      capsule={capsule}
                      user={user}
                      layoutType="grid"
                    />
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    No capsules found
                  </div>
                )}
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Trending Sidebar */}
        <div className="lg:w-80 space-y-6">
          {/* Trending Tags */}
          <div className="bg-card rounded-lg p-4 border border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <Hash className="w-5 h-5" />
              <h2 className="font-semibold">Trending Tags</h2>
            </div>
            <div className="space-y-2">
              {trendingTags.map(({ tag, count }) => (
                <Button
                  key={tag}
                  variant="ghost"
                  className="w-full justify-between"
                  onClick={() => setSearchTerm(tag)}
                >
                  <span>#{tag}</span>
                  <span className="text-muted-foreground">{count}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Trending Capsules */}
          <div className="bg-card rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5" />
              <h2 className="font-semibold">Trending Capsules</h2>
            </div>
            <div className="space-y-4">
              {trendingCapsules.map((capsule) => (
                <div
                  key={capsule.id}
                  className="p-3 hover:bg-accent rounded-md transition-colors border border-gray-700"
                >
                  <h3 className="font-medium">{capsule.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {capsule.description}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {capsule.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
