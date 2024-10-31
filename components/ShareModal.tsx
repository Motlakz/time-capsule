import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { Icons } from "@/components/ui/icons";
  import { toast } from "@/hooks/use-toast";
  import { TimeCapsule } from "@/types";
  
  interface ShareCapsuleDialogProps {
    isOpen: boolean;
    onClose: () => void;
    capsule: TimeCapsule;
  }
  
  type SharePlatform = 'email' | 'facebook' | 'twitter' | 'instagram' | 'copy';
  
  export function ShareCapsuleDialog({
    isOpen,
    onClose,
    capsule,
  }: ShareCapsuleDialogProps) {
    const shareUrl = `${window.location.origin}/capsules/${capsule.id}`;
  
    const handleShare = (platform: SharePlatform) => {
      const shareText = `Check out my time capsule: ${capsule.title}`;
      const encodedText = encodeURIComponent(shareText);
      const encodedUrl = encodeURIComponent(shareUrl);
  
      const shareLinks: Record<Exclude<SharePlatform, 'copy'>, string> = {
        email: `mailto:?subject=${encodedText}&body=${encodedUrl}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
        instagram: `https://www.instagram.com/share?url=${encodedUrl}`,
      };
  
      if (platform === 'copy') {
        navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link copied!",
          description: "The capsule link has been copied to your clipboard.",
        });
        return;
      }
  
      window.open(shareLinks[platform], '_blank', 'width=600,height=400');
    };
  
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Time Capsule</DialogTitle>
            <DialogDescription>
              Share this time capsule with your friends and family through various platforms.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 py-4">
            <Button
              variant="outline"
              className="flex flex-col items-center gap-2 h-auto py-4"
              onClick={() => handleShare('email')}
            >
              <Icons.mail className="h-8 w-8 text-blue-500" />
              <span className="text-xs">Email</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center gap-2 h-auto py-4"
              onClick={() => handleShare('facebook')}
            >
              <Icons.facebook className="h-8 w-8 text-blue-600" />
              <span className="text-xs">Facebook</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center gap-2 h-auto py-4"
              onClick={() => handleShare('twitter')}
            >
              <Icons.twitter className="h-8 w-8 text-blue-400" />
              <span className="text-xs">Twitter</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center gap-2 h-auto py-4"
              onClick={() => handleShare('instagram')}
            >
              <Icons.instagram className="h-8 w-8 text-pink-500" />
              <span className="text-xs">Instagram</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center gap-2 h-auto py-4"
              onClick={() => handleShare('copy')}
            >
              <Icons.copy className="h-8 w-8 text-gray-500" />
              <span className="text-xs">Copy Link</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
}
