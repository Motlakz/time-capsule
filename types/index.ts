export type User = {
    userId: string;
    email: string;
    name: string;
    image?: string;
    is2FAEnabled: boolean;
    role: 'user' | 'admin';
    createdAt: Date;
    updatedAt?: Date;
};

export type TimeCapsule = {
    id: string;
    userId: string;
    title: string;
    description: string;
    isPrivate: boolean;
    scheduledReveal: Date;
    selfDestructDate?: Date;
    tags: string[];
    collaborators: string[];
    files: string;
    status: 'draft' | 'scheduled' | 'revealed' | 'destroyed';
    createdAt: Date;
    updatedAt: Date;
};

export type FileAttachment = {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
};

export type NotificationType = 
    | 'capsule_reveal'
    | 'capsule_invite'
    | 'comment'
    | 'mention'
    | 'capsule_edit'
    | 'self_destruct_warning'
    | 'security_alert';

export type NotificationStatus = 'unread' | 'read' | 'archived';

export type Notification = {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    referenceId?: string;
    referenceType?: 'capsule' | 'comment' | 'user';
    status: NotificationStatus;
    createdAt: Date;
    readAt?: Date;
};

export type Comment = {
    id: string;
    capsuleId: string;
    userId: string;
    // userName: string,
    content: string;
    parentId?: string;
    createdAt: Date;
};
