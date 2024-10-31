/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from 'framer-motion';
import { addHours, format, formatDistanceToNow, isAfter, isBefore } from 'date-fns';
import { FileAttachment, TimeCapsule, User } from '@/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Comments } from '@/components/capsules/Comments';
import { useState } from 'react';
import { toast } from "@/hooks/use-toast";
import { DeleteCapsuleDialog } from '../DeleteModal';
import { ShareCapsuleDialog } from '../ShareModal';
import { cn } from "@/lib/utils";

interface CapsuleCardProps {
  user: User;
  capsule: TimeCapsule;
  onEdit?: () => void;
  onDelete?: () => void;
  layoutType?: 'grid' | 'list';
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  },
  hover: { 
    y: -5,
    transition: { duration: 0.2 }
  }
};

export function CapsuleCard({ capsule, onEdit, onDelete, user, layoutType = 'grid' }: CapsuleCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);  
  const isRevealed = capsule.status === 'revealed';
  const isDestroyed = capsule.status === 'destroyed';
  const canComment = !capsule.isPrivate || 
                    capsule.userId === user.userId || 
                    capsule.collaborators.includes(user.userId);

  const isLocked = (capsule: TimeCapsule) => {
    const now = new Date();
    const lockTime = addHours(new Date(capsule.createdAt), 12);
    const revealDate = new Date(capsule.scheduledReveal);
    
    return isAfter(now, lockTime) && isBefore(now, revealDate);
  };

  const handleLockedClick = () => {
    const timeUntilReveal = formatDistanceToNow(new Date(capsule.scheduledReveal));
    toast({
      title: "Time Capsule is locked",
      description: `This capsule will be revealed in ${timeUntilReveal}`,
      variant: "default",
    });
  };

  const handleFileClick = (file: FileAttachment) => {
    if (file.type.startsWith('image/')) {
      window.open(file.url, '_blank');
    } else {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={`relative flex flex-col ${layoutType === 'list' ? 'border-b' : ''}`} 
    >
      <Card className={`flex flex-col border dark:border-gray-700 rounded-lg ${isDestroyed ? 'opacity-50' : ''}`}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="line-clamp-1">{capsule.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {capsule.description}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant={capsule.isPrivate ? "secondary" : "outline"}>
                {capsule.isPrivate ? "Private" : "Public"}
              </Badge>
              <Badge variant={isRevealed ? "default" : isDestroyed ? "destructive" : "secondary"}>
                {capsule.status}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Icons.calendar className="h-4 w-4 opacity-70" />
              <span className="text-sm">
                Reveals on {format(new Date(capsule.scheduledReveal), 'PPP')}
              </span>
            </div>
            
            {capsule.files && (
              <div className="space-y-2">
                <div className="flex items-center space-x-4">
                  <Icons.paperclip className="h-4 w-4 opacity-70" />
                  <span className="text-sm">
                    {JSON.parse(capsule.files).length} attachment{JSON.parse(capsule.files).length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {JSON.parse(capsule.files).map((file: FileAttachment) => (
                    <button
                      key={file.id}
                      onClick={() => handleFileClick(file)}
                      className="relative border dark:border-gray-700 aspect-square rounded-md overflow-hidden group hover:ring-2 hover:ring-primary transition-all"
                    >
                      {file.type.startsWith('image/') ? (
                        <>
                          <img
                            src={file.url}
                            alt={file.name}
                            className="object-cover w-full h-full"
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Icons.maximize2 className="h-6 w-6 text-white" />
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100 p-2">
                          <Icons.file className="h-8 w-8 opacity-50" />
                          <span className="text-xs text-gray-500 mt-1 truncate w-full text-center">
                            {file.name}
                          </span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {capsule.collaborators.length > 0 && (
              <div className="flex -space-x-2">
                {capsule.collaborators.map((collaborator, index) => (
                  <Avatar key={index} className="border-2 border-background">
                    <AvatarImage src={`/avatars/${collaborator}.png`} />
                    <AvatarFallback>CO</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {capsule.tags.map((tag, index) => (
                <Badge key={index} className="border dark:border-gray-700 rounded-lg" variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex flex-wrap gap-2">
            {canComment && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowComments(!showComments)}
                className={cn(
                  "gap-2 mr-2 w-full border dark:border-gray-700 rounded-lg",
                  showComments && "bg-muted"
                )}
              >
                <Icons.messageSquare className="h-4 w-4" />
                {showComments ? "Hide Comments" : "Show Comments"}
              </Button>
            )}
          </div>

          <div className="flex flex-col w-full md:flex-row-reverse gap-2 mt-2 md:mt-0">
            <DeleteCapsuleDialog
              isOpen={showDeleteDialog}
              onClose={() => setShowDeleteDialog(false)}
              onConfirm={() => {
                onDelete?.();
                setShowDeleteDialog(false);
              }}
              capsuleTitle={capsule.title}
            />

            <ShareCapsuleDialog
              isOpen={showShareDialog}
              onClose={() => setShowShareDialog(false)}
              capsule={capsule}
            />

            <Button 
              variant="outline" 
              size="sm" 
              className="border dark:border-gray-700 rounded-lg"
              onClick={() => setShowShareDialog(true)}
              disabled={isDestroyed}
            >
              <Icons.share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onEdit} 
              className="border dark:border-gray-700 rounded-lg"
              disabled={isDestroyed || isLocked(capsule) || isRevealed}
            >
              <Icons.edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              className="border dark:border-gray-700 rounded-lg"
              onClick={() => setShowDeleteDialog(true)} 
              disabled={isDestroyed || isLocked(capsule)}
            >
              <Icons.trash className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Comments Section */}
      {showComments && canComment && ( 
        <div className="mt-4 w-full border rounded-lg p-4 bg-muted/50">
          <Comments
            capsuleId={capsule.id}
            user={user}
            capsuleOwnerId={capsule.userId}
          />
        </div>
      )}

      {/* Lock overlay */}
      {isLocked(capsule) && (
        <div 
          className="absolute inset-0 bg-background/80 backdrop-blur-sm border dark:border-gray-700 rounded-lg
            flex flex-col items-center justify-center gap-4 cursor-not-allowed"
          onClick={handleLockedClick}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <Icons.lock className="h-16 w-16 text-primary" />
          </motion.div>
          <div className="text-center px-4">
            <h3 className="font-semibold text-lg mb-1">Time Capsule Locked</h3>
            <p className="text-sm text-muted-foreground">
              This capsule will be revealed on{' '}
              {format(new Date(capsule.scheduledReveal), 'PPP')}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
