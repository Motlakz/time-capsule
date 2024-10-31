"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Trash, CornerDownRight } from "lucide-react";
import { Comment } from "@/types";
import { createComment, databases, appwriteConfig } from "@/lib/appwrite";
import { Query, Models } from "appwrite";

interface CommentDocument extends Models.Document {
  capsuleId: string;
  userId: string;
  content: string;
  parentId?: string;
}

function convertDocToComment(doc: CommentDocument): Comment {
  return {
    id: doc.$id,
    capsuleId: doc.capsuleId,
    userId: doc.userId,
    content: doc.content,
    parentId: doc.parentId,
    createdAt: new Date(doc.$createdAt)
  };
}

interface User {
  id: string;
  name: string;
  image?: string;
}

interface CommentsProps {
  capsuleId: string;
  user: User;
  isPublic?: boolean;
}

function CommentComposer({ 
  user, 
  capsuleId,
  parentId,
  onCommentAdded,
  isReply = false
}: { 
  user: User;
  capsuleId: string;
  parentId?: string;
  onCommentAdded: () => void;
  isReply?: boolean;
}) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    try {
      await createComment({
        capsuleId,
        userId: user.id,
        content: content.trim(),
        parentId
      });
      
      setContent("");
      onCommentAdded();
    } catch (error) {
      console.error("Error creating comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn("space-y-4", isReply ? "pl-4" : "p-4")}>
      <div className="flex space-x-4">
        {isReply && <CornerDownRight className="h-4 w-4 text-muted-foreground mt-2" />}
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.image} />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={isReply ? "Write a reply..." : "Write a comment..."}
          className={cn("min-h-[100px]", isReply ? "text-sm" : "")}
        />
      </div>
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={!content.trim() || isSubmitting}
          size={isReply ? "sm" : "default"}
        >
          {isSubmitting ? (isReply ? "Replying..." : "Posting...") : (isReply ? "Reply" : "Comment")}
        </Button>
      </div>
    </div>
  );
}

function CommentItem({ 
  comment,
  user,
  capsuleId,
  onCommentAdded,
  onDelete,
  depth = 0
}: { 
  comment: Comment;
  user: User;
  capsuleId: string;
  onCommentAdded: () => void;
  onDelete: (commentId: string) => void;
  depth?: number;
}) {
  const [isReplying, setIsReplying] = useState(false);
  const [replies, setReplies] = useState<Comment[]>([]);
  const [showReplies, setShowReplies] = useState(false);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);

  const isOwnComment = user.id === comment.userId;
  const canReply = depth < 3; // Limit reply depth to 3 levels

  useEffect(() => {
    if (showReplies) {
      loadReplies();
    }
  }, [showReplies]);

  const loadReplies = async () => {
    if (isLoadingReplies) return;
    
    setIsLoadingReplies(true);
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.comments,
        [
          Query.equal('parentId', [comment.id]),
          Query.orderDesc('$createdAt')
        ]
      );
      
      const commentReplies = response.documents.map((doc) => 
        convertDocToComment(doc as CommentDocument)
      );
      setReplies(commentReplies);
    } catch (error) {
      console.error("Error loading replies:", error);
    } finally {
      setIsLoadingReplies(false);
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(comment.id);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className={cn(
      "flex space-x-3 p-4",
      depth > 0 && "pl-8 border-l"
    )}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={user.image} />
        <AvatarFallback>{comment.userId[0]}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-semibold">
              {comment.userId}
              {isOwnComment && (
                <span className="ml-2 text-xs text-muted-foreground">(You)</span>
              )}
            </span>
            <span className="text-sm text-muted-foreground">
              {comment.createdAt.toLocaleDateString()}
            </span>
          </div>
          
          {isOwnComment && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-destructive"
            >
              <Trash className="h-4 w-4" />
            </Button>
          )}
        </div>

        <p className="mt-2 text-sm">{comment.content}</p>

        {canReply && (
          <div className="mt-2 flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsReplying(!isReplying)}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              {isReplying ? "Cancel Reply" : "Reply"}
              {isOwnComment && " to Self"}
            </Button>

            {!comment.parentId && replies.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplies(!showReplies)}
              >
                {showReplies ? "Hide replies" : `Show ${replies.length} ${replies.length === 1 ? "reply" : "replies"}`}
              </Button>
            )}
          </div>
        )}

        {isReplying && (
          <div className="mt-4">
            <CommentComposer
              user={user}
              capsuleId={capsuleId}
              parentId={comment.id}
              onCommentAdded={() => {
                setIsReplying(false);
                onCommentAdded();
                if (showReplies) {
                  loadReplies();
                }
              }}
              isReply={true}
            />
          </div>
        )}

        {showReplies && (
          <div className="mt-4 space-y-4">
            {isLoadingReplies ? (
              <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900" />
              </div>
            ) : replies.length > 0 ? (
              replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  user={user}
                  capsuleId={capsuleId}
                  onCommentAdded={onCommentAdded}
                  onDelete={onDelete}
                  depth={depth + 1}
                />
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No replies yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function Comments({ capsuleId, user, isPublic = false }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadComments = async () => {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.comments,
        [
          Query.equal('capsuleId', [capsuleId]),
          Query.isNull('parentId'),
          Query.orderDesc('$createdAt')
        ]
      );

      const commentsList = response.documents.map((doc) => 
        convertDocToComment(doc as CommentDocument)
      );
      setComments(commentsList);
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [capsuleId]);

  const handleDeleteComment = async (commentId: string) => {
    try {
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.comments,
        commentId
      );
      await loadComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card">
      <CommentComposer 
        user={user} 
        capsuleId={capsuleId}
        onCommentAdded={loadComments}
      />
      
      <div className="divide-y">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              user={user}
              capsuleId={capsuleId}
              onCommentAdded={loadComments}
              onDelete={handleDeleteComment}
            />
          ))
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>
    </div>
  );
}