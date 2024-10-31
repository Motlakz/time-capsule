import { Account, Client, Databases, Storage, ID, Query } from 'appwrite';
import { TimeCapsule, Comment, Notification, NotificationType } from '@/types';

// Client Config
export const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

// Services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Configuration Constants
export const appwriteConfig = {
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    collections: {
        users: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
        capsules: process.env.NEXT_PUBLIC_APPWRITE_CAPSULES_COLLECTION_ID!,
        comments: process.env.NEXT_PUBLIC_APPWRITE_COMMENTS_COLLECTION_ID!,
        notifications: process.env.NEXT_PUBLIC_APPWRITE_NOTIFICATIONS_COLLECTION_ID!
    },
    buckets: {
        capsuleFiles: process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!
    }
};

// Auth Functions
export async function createUserAccount(email: string, password: string, name: string, role: 'user' | 'admin') {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            name
        );

        if (!newAccount) throw Error;

        // Return the user information directly
        return {
            userId: newAccount.$id,
            email: newAccount.email,
            name: newAccount.name,
            is2FAEnabled: false,
            role: role, // Role can be managed in your application logic
            createdAt: new Date(),
            updatedAt: new Date()
        };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function signInAccount(email: string, password: string) {
    try {
        // Step 1: Create a session for the user
        const session = await account.createEmailPasswordSession(email, password);

        // Step 2: Fetch user details from the account service
        const userDetails = await account.get();

        // Return user information directly from the session and user details
        return {
            userId: session.$id,
            email: userDetails.email,
            name: userDetails.name || '',
            is2FAEnabled: false,
            role: 'user',
            createdAt: new Date(),
            updatedAt: new Date()
        };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function sendMagicLink(email: string, redirectUrl: string, name?: string, expire?: boolean) {
    try {
        // Send a magic link to the user's email
        const response = await account.createMagicURLToken(email, redirectUrl, name, expire);
        console.log(`Magic link sent to ${email}:`, response);
    } catch (error) {
        console.error('Error sending magic link:', error);
        throw error;
    }
}

export async function sendEmailOTP(email: string) {
    try {
        // Send an OTP to the user's email
        const response = await account.createVerification(email);
        console.log(`OTP sent to ${email}:`, response);
    } catch (error) {
        console.error('Error sending OTP:', error);
        throw error;
    }
}

export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();

        if (!currentAccount) throw Error;

        // Return user information directly from the account
        return {
            userId: currentAccount.$id,
            email: currentAccount.email,
            name: currentAccount.name, // This may not be available directly; consider fetching user details if needed
            is2FAEnabled: false,
            role: 'user', // Default role; adjust as necessary
            createdAt: new Date(),
            updatedAt: new Date()
        };
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function signOutAccount() {
    try {
        return await account.deleteSession('current');
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function deleteAccount(userId: string): Promise<void> {
    try {
        await account.deleteIdentity(userId);
    } catch (error) {
        console.error('Error deleting account:', error);
        throw error;
    }
}

// Capsule Functions
export async function createCapsule(capsule: Omit<TimeCapsule, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
        const newCapsule = {
            ...capsule,
            id: ID.unique(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            // Don't modify the files field, pass it as is
            files: capsule.files
        };

        return await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.collections.capsules,
            newCapsule.id,
            newCapsule
        );
    } catch (error) {
        console.error('Error creating capsule:', error);
        throw error;
    }
}

export async function getCapsule(capsuleId: string) {
    try {
        return await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.collections.capsules,
            capsuleId
        );
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getUserCapsules(userId: string) {
    try {
        return await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.collections.capsules,
            [
                Query.equal('userId', userId),
                Query.orderDesc('createdAt')
            ]
        );
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function updateCapsule(capsule: TimeCapsule) {
    try {
        return await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.collections.capsules,
            capsule.id,
            {
                ...capsule,
                updatedAt: new Date() 
            }
        );
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function deleteCapsule(capsuleId: string) {
    try {
        await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.collections.capsules,
            capsuleId
        );
        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function createComment(comment: Omit<Comment, 'id' | 'createdAt'>) {
    try {
        const documentId = ID.unique();
        const timestamp = new Date().toISOString();
        
        const commentData = {
            id: documentId,
            capsuleId: comment.capsuleId,
            userId: comment.userId,
            content: comment.content,
            parentId: comment.parentId || null,
            createdAt: timestamp
        };

        const response = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.collections.comments,
            documentId,
            commentData
        );

        return response;
    } catch (error) {
        console.error("Error creating comment:", error);
        throw error;
    }
}

// Notification Functions
export async function createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    referenceId?: string,
    referenceType?: 'capsule' | 'comment' | 'user'
) {
    try {
        const notification: Omit<Notification, 'id'> = {
            userId,
            type,
            title,
            message,
            referenceId,
            referenceType,
            status: 'unread',
            createdAt: new Date()
        };

        return await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.collections.notifications,
            ID.unique(),
            notification
        );
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getUserNotifications(userId: string) {
    try {
        return await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.collections.notifications,
            [
                Query.equal('userId', userId),
                Query.orderDesc('createdAt')
            ]
        );
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function markNotificationAsRead(notificationId: string) {
    try {
      if (!notificationId) {
        throw new Error('Notification ID is required');
      }
  
      const response = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.notifications,
        notificationId,
        {
          status: 'read',
          readAt: new Date().toISOString()
        }
      );
      return response;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
}

export async function deleteNotification(notificationId: string) {
    try {
        await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.collections.notifications,
            notificationId
        );
        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// File Upload Function
export async function uploadFile(file: File) {
    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.buckets.capsuleFiles,
            ID.unique(),
            file
        );

        // Get file URL as string
        const fileUrl = storage.getFileView(
            appwriteConfig.buckets.capsuleFiles,
            uploadedFile.$id
        ).toString();

        return {
            id: uploadedFile.$id,
            name: uploadedFile.name,
            url: fileUrl,
            type: uploadedFile.mimeType,
            size: uploadedFile.sizeOriginal
        };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function deleteFile(fileId: string) {
    try {
        await storage.deleteFile(
            appwriteConfig.buckets.capsuleFiles,
            fileId
        );
        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
