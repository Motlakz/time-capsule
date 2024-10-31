import Feed from '@/components/Feed';
import { mockUser, mockCapsules, mockTrendingTags, mockTrendingCapsules } from '@/lib/mock-data';

export default function FeedPage() {
    return (
        <Feed
            user={mockUser}
            publicCapsules={mockCapsules}
            trendingTags={mockTrendingTags}
            trendingCapsules={mockTrendingCapsules}
        />
    );
}
