import { databases, appwriteConfig } from '@/lib/appwrite';
import { 
    mockCapsules, 
    mockComments, 
    mockNotifications,
    mockUsers 
} from '@/lib/mock-data';
import { User, TimeCapsule, Notification, Comment } from '@/types';
import { ID, Models, Query } from 'appwrite';

// Define Appwrite document types
type AppwriteUser = Models.Document & User;
type AppwriteTimeCapsule = Models.Document & TimeCapsule;
type AppwriteNotification = Models.Document & Notification;
type AppwriteComment = Models.Document & Comment;

type UserIdMap = Record<string, string>;
type CapsuleIdMap = Record<string, string>;

export async function seedDatabase() {
    try {
        // Check if the database is already seeded by looking for existing capsules
        const existingCapsules = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.collections.capsules,
            [Query.limit(1)] // Limit to 1 document to check existence
        );

        // If there are existing capsules, skip seeding
        if (existingCapsules.total > 0) {
            console.log('Database already seeded, skipping...');
            return { success: false }; // Indicate that seeding was skipped
        }

        // Clear existing collections (if necessary)
        const collections = [
            appwriteConfig.collections.users,
            appwriteConfig.collections.capsules,
            appwriteConfig.collections.comments,
            appwriteConfig.collections.notifications
        ];

        for (const collectionId of collections) {
            try {
                const existing = await databases.listDocuments(
                    appwriteConfig.databaseId, 
                    collectionId,
                    [Query.limit(100)]
                );
                
                if (existing.total > 0) {
                    await Promise.allSettled(
                        existing.documents.map(doc => 
                            databases.deleteDocument(
                                appwriteConfig.databaseId, 
                                collectionId, 
                                doc.$id
                            ).catch(err => {
                                console.warn(`Failed to delete document ${doc.$id}:`, err);
                                return null;
                            })
                        )
                    );
                    console.log(`Cleared collection: ${collectionId}`);
                }
            } catch (err) {
                console.warn(`Error clearing collection ${collectionId}:`, err);
            }
        }

        // Create users with unique IDs
        const userPromises = Object.values(mockUsers).map(async userData => {
            try {
                const userDoc = {
                    ...userData,
                    createdAt: userData.createdAt.toISOString(),
                    updatedAt: userData.updatedAt?.toISOString(),
                    id: ID.unique(),
                };
                
                return await databases.createDocument<AppwriteUser>(
                    appwriteConfig.databaseId,
                    appwriteConfig.collections.users,
                    userDoc.id,
                    userDoc
                );
            } catch (err) {
                console.warn(`Failed to create user:`, err);
                throw err;
            }
        });

        const createdUsersResults = await Promise.allSettled(userPromises);
        const createdUsers = createdUsersResults
            .filter((result): result is PromiseFulfilledResult<AppwriteUser> => result.status === 'fulfilled')
            .map(result => result.value);

        // Create user ID mapping
        const userIdMap: UserIdMap = Object.fromEntries(
            createdUsers.map(user => [user.userId, user.$id])
        );

        // Create capsules with unique IDs
        const capsulePromises = mockCapsules.map(async capsule => {
            try {
                const capsuleDoc = {
                    ...capsule,
                    id: ID.unique(),
                    userId: userIdMap[capsule.userId],
                    collaborators: capsule.collaborators.map(id => userIdMap[id]),
                    scheduledReveal: capsule.scheduledReveal.toISOString(),
                    createdAt: capsule.createdAt.toISOString(),
                    updatedAt: capsule.updatedAt.toISOString(),
                };
                
                return await databases.createDocument<AppwriteTimeCapsule>(
                    appwriteConfig.databaseId,
                    appwriteConfig.collections.capsules,
                    capsuleDoc.id,
                    capsuleDoc
                );
            } catch (err) {
                console.warn(`Failed to create capsule:`, err);
                throw err;
            }
        });

        const createdCapsulesResults = await Promise.allSettled(capsulePromises);
        const createdCapsules = createdCapsulesResults
            .filter((result): result is PromiseFulfilledResult<AppwriteTimeCapsule> => result.status === 'fulfilled')
            .map(result => result.value);

        // Create capsule ID mapping
        const capsuleIdMap: CapsuleIdMap = Object.fromEntries(
            createdCapsules.map(capsule => [capsule.originalMockId, capsule.$id])
        );

        // Create comments with unique IDs
        const commentPromises = mockComments.map(async comment => {
            try {
                const commentDoc = {
                    ...comment,
                    id: ID.unique(),
                    userId: userIdMap[comment.userId],
                    capsuleId: capsuleIdMap[comment.capsuleId],
                    parentId: comment.parentId ? capsuleIdMap[comment.parentId] : undefined,
                    createdAt: comment.createdAt.toISOString(),
                };
                
                return await databases.createDocument<AppwriteComment>(
                    appwriteConfig.databaseId,
                    appwriteConfig.collections.comments,
                    commentDoc.id,
                    commentDoc
                );
            } catch (err) {
                console.warn(`Failed to create comment:`, err);
                return null;
            }
        });

        await Promise.allSettled(commentPromises);

        // Create notifications with unique IDs
        const notificationPromises = mockNotifications.map(async notification => {
            try {
                const notificationId = ID.unique();
                const notificationDoc = {
                    userId: userIdMap[notification.userId],
                    type: notification.type,
                    title: notification.title,
                    message: notification.message,
                    referenceId: notification.referenceId ? capsuleIdMap[notification.referenceId] : undefined,
                    referenceType: notification.referenceType,
                    status: notification.status,
                    createdAt: notification.createdAt.toISOString(),
                    readAt: notification.readAt?.toISOString(),
                };
                
                return await databases.createDocument<AppwriteNotification>(
                    appwriteConfig.databaseId,
                    appwriteConfig.collections.notifications,
                    notificationId,
                    notificationDoc
                );
            } catch (err) {
                console.warn(`Failed to create notification:`, err);
                return null;
            }
        });

        await Promise.allSettled(notificationPromises);

        console.log('Database seeded successfully');
        return { success: true, userIdMap, capsuleIdMap };
    } catch (error) {
        console.error('Error seeding database:', error);
        throw error;
    }
}
