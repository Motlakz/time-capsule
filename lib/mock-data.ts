import { TimeCapsule, User, Notification, Comment } from '@/types';

// Demo user
export const mockUser: User = {
    id: process.env.APPWRITE_USER_ID!,
    userId: process.env.APPWRITE_USER_ID!,
    name: process.env.APPWRITE_USERNAME!,
    email: process.env.APPWRITE_USER_EMAIL!,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
    is2FAEnabled: false,
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date()
};

// Mock users for comments
export const mockUsers = {
    '1': mockUser,
    '2': {
        userId: '2',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
        is2FAEnabled: false,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    '3': {
        userId: '3',
        name: 'Bob Smith',
        email: 'bob@example.com',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
        is2FAEnabled: false,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    '4': {
        userId: '4',
        name: 'Carol White',
        email: 'carol@example.com',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carol',
        is2FAEnabled: false,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    '5': {
        userId: '5',
        name: 'David Brown',
        email: 'david@example.com',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
        is2FAEnabled: false,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    '6': {
        userId: '6',
        name: 'Eve Davis',
        email: 'eve@example.com',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=eve',
        is2FAEnabled: false,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
    }
};

export const mockCapsules: TimeCapsule[] = [
    {
        id: '1',
        userId: '1',
        title: 'My Wedding Day Memories',
        description: 'A collection of special moments from our wedding day, to be opened on our 5th anniversary.',
        isPrivate: false,
        scheduledReveal: new Date('2029-10-15'),
        tags: ['wedding', 'love', 'memories'],
        collaborators: ['2'],
        files: '',
        status: 'scheduled',
        createdAt: new Date('2024-10-15'),
        updatedAt: new Date('2024-10-15'),
        originalMockId: '1',
        referenceId: '1'
    },
    {
        id: '2',
        userId: '2',
        title: 'Startup Journey 2024',
        description: 'Documenting our tech startup\'s first year milestones and challenges.',
        isPrivate: false,
        scheduledReveal: new Date('2025-10-10'),
        tags: ['startup', 'tech', 'entrepreneurship'],
        collaborators: ['3', '4'],
        files: '',
        status: 'scheduled',
        createdAt: new Date('2024-10-10'),
        updatedAt: new Date('2024-10-10'),
        originalMockId: '2',
        referenceId: '2'
    },
    {
        id: '3',
        userId: '3',
        title: 'World Travel Collection 2024',
        description: 'Photos and stories from backpacking across Southeast Asia.',
        isPrivate: false,
        scheduledReveal: new Date('2025-01-01'),
        tags: ['travel', 'adventure', 'photography'],
        collaborators: [],
        files: '',
        status: 'scheduled',
        createdAt: new Date('2024-10-05'),
        updatedAt: new Date('2024-10-05'),
        originalMockId: '3',
        referenceId: '3'
    },
    {
        id: '4',
        userId: '4',
        title: 'College Graduation Time Capsule',
        description: 'Messages, photos, and memories from our graduating class of 2024.',
        isPrivate: false,
        scheduledReveal: new Date('2029-09-30'),
        tags: ['graduation', 'college', 'memories'],
        collaborators: ['6'],
        files: '',
        status: 'scheduled',
        createdAt: new Date('2024-09-30'),
        updatedAt: new Date('2024-09-30'),
        originalMockId: '4',
        referenceId: '4'
    },
    {
        id: '5',
        userId: '5',
        title: 'First Year of College',
        description: 'Memories from freshman year - now revealed!',
        isPrivate: false,
        scheduledReveal: new Date('2024-09-01'),
        tags: ['college', 'memories', 'friends'],
        collaborators: ['3'],
        files: '',
        status: 'revealed',
        createdAt: new Date('2023-09-01'),
        updatedAt: new Date('2024-09-01'),
        originalMockId: '5',
        referenceId: '5'
    },
    {
        id: '6',
        userId: '6',
        title: 'Summer Road Trip 2023',
        description: 'Coast to coast adventure - finally sharing these memories!',
        isPrivate: false,
        scheduledReveal: new Date('2024-06-15'),
        tags: ['travel', 'adventure', 'summer'],
        collaborators: ['1', '4'],
        files: '',
        status: 'revealed',
        createdAt: new Date('2023-06-15'),
        updatedAt: new Date('2024-06-15'),
        originalMockId: '6',
        referenceId: '6'
    }
];

export const mockComments: Comment[] = [
    // Comments on locked capsules
    {
        id: '1',
        capsuleId: '1',
        userId: '2',
        content: 'What a beautiful collection of memories!',
        createdAt: new Date('2024-10-16')
    },
    // Comments on revealed capsules
    {
        id: '2',
        capsuleId: '8',
        userId: '5',
        content: 'Those freshman year memories are priceless! Remember that crazy finals week?',
        createdAt: new Date('2024-09-02'),
        parentId: undefined
    },
    {
        id: '3',
        capsuleId: '2',
        userId: '3',
        content: 'The dorm party photos are hilarious! 😄',
        createdAt: new Date('2024-09-02'),
        parentId: undefined
    },
    {
        id: '4',
        capsuleId: '5',
        userId: '2',
        content: 'Thanks for the memories everyone!',
        createdAt: new Date('2024-09-03'),
        parentId: '2'
    },
    {
        id: '5',
        capsuleId: '6',
        userId: '4',
        content: 'That sunset photo at the Grand Canyon is breathtaking!',
        createdAt: new Date('2024-06-16'),
        parentId: undefined
    },
    {
        id: '6',
        capsuleId: '4',
        userId: '7',
        content: 'Best road trip ever! We should do it again.',
        createdAt: new Date('2024-06-17'),
        parentId: undefined
    }
];

export const mockTrendingTags = [
    { tag: 'memories', count: 156 },
    { tag: 'tech', count: 89 },
    { tag: 'travel', count: 75 },
    { tag: 'photography', count: 62 },
    { tag: 'startup', count: 45 },
];

export const mockTrendingCapsules = mockCapsules.slice(0, 3).map(capsule => ({
    ...capsule,
    collaborators: Array.from(
        { length: Math.floor(Math.random() * 5) + 1 },
        (_, i) => `trending-${i}`
    ),
}));

export const mockNotifications: Notification[] = [
    {
        id: '1',
        userId: '1',
        type: 'capsule_reveal',
        title: 'Capsule Ready to Open',
        message: 'Your wedding memories capsule is ready to be revealed!',
        referenceId: '1',
        referenceType: 'capsule',
        status: 'unread',
        createdAt: new Date(),
    },
    {
        id: '2',
        userId: '2',
        type: 'comment',
        title: 'New Comment',
        message: 'Someone commented on your revealed college capsule!',
        referenceId: '5',
        referenceType: 'capsule',
        status: 'unread',
        createdAt: new Date(),
    }
];
