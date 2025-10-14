import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FeedService, { FeedItem, feedService } from '@/app/services/feedService';
import { authFeed } from '@/Redux/authSlice';

interface UseFeedOptions {
  autoFetch?: boolean;
  page?: number;
  limit?: number;
}

interface UseFeedReturn {
  feeds: FeedItem[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  hasMore: boolean;
  currentPage: number;
  totalFeeds: number;
  
  // Actions
  fetchFeeds: (page?: number, limit?: number) => Promise<void>;
  refreshFeeds: () => Promise<void>;
  likeFeed: (feedId: string) => Promise<void>;
  unlikeFeed: (feedId: string) => Promise<void>;
  bookmarkFeed: (feedId: string) => Promise<void>;
  shareFeed: (feedId: string) => Promise<string>;
  loadMore: () => Promise<void>;
}

export const useFeed = (options: UseFeedOptions = {}): UseFeedReturn => {
  const {
    autoFetch = true,
    page = 1,
    limit = 20,
  } = options;

  const dispatch = useDispatch();
  
  // Get data from Redux store
  const reduxData = useSelector((state: any) => state.auth);
  const reduxFeeds = reduxData?.auth_feed || [];
  const reduxLoading = reduxData?.loading || false;
  const reduxError = reduxData?.error || null;

  console.log('Redux state:', {
    auth_feed: reduxData?.auth_feed,
    loading: reduxData?.loading,
    error: reduxData?.error,
    hasAuthFeed: !!reduxData?.auth_feed
  });

  // Local state for pagination and UI state
  const [localFeeds, setLocalFeeds] = useState<FeedItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(page);
  const [totalFeeds, setTotalFeeds] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);

  // Combine Redux and local feeds
  const feeds = reduxFeeds.length > 0 ? reduxFeeds : localFeeds;
  const loading = reduxLoading;
  const error = reduxError || localError;

  // Fetch feeds using Redux action
  const fetchFeeds = useCallback(async (pageNum: number = page, limitNum: number = limit) => {
    try {
      setLocalError(null);

      const token = await feedService.getAuthToken();

      await dispatch(authFeed({ access_token: token ?? undefined }) as any);

      setCurrentPage(pageNum);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to fetch feeds');
    }
  }, [dispatch, page, limit]);

  // Refresh feeds
  const refreshFeeds = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchFeeds(1, limit);
      setHasMore(true);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to refresh feeds');
    } finally {
      setRefreshing(false);
    }
  }, [fetchFeeds, limit]);

  // Load more feeds
  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;

    try {
      const nextPage = currentPage + 1;
      const token = await feedService['getAuthToken']();
      
      // For now, we'll use the existing Redux logic
      // In a real implementation, you might want to append to existing feeds
      await fetchFeeds(nextPage, limit);
      
      // Check if we have more data (this would come from API response)
      setHasMore(false); // Temporary - adjust based on actual API response
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to load more feeds');
    }
  }, [currentPage, hasMore, loading, fetchFeeds, limit]);

  // Like a feed
  const likeFeed = useCallback(async (feedId: string) => {
    try {
      await feedService.likeFeed(feedId);
      
      // Update local state optimistically
      setLocalFeeds(prevFeeds =>
        prevFeeds.map(feed =>
          feed.id === feedId
            ? { ...feed, likes: feed.likes || 0 + 1, isLiked: true }
            : feed
        )
      );
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to like feed');
      // Revert optimistic update on error
      setLocalFeeds(prevFeeds =>
        prevFeeds.map(feed =>
          feed.id === feedId
            ? { ...feed, likes: Math.max(0, feed.likes || 0 - 1), isLiked: false }
            : feed
        )
      );
    }
  }, []);

  // Unlike a feed
  const unlikeFeed = useCallback(async (feedId: string) => {
    try {
      await feedService.unlikeFeed(feedId);
      
      // Update local state optimistically
      setLocalFeeds(prevFeeds =>
        prevFeeds.map(feed =>
          feed.id === feedId
            ? { ...feed, likes: Math.max(0, feed.likes || 0 - 1), isLiked: false }
            : feed
        )
      );
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to unlike feed');
      // Revert optimistic update on error
      setLocalFeeds(prevFeeds =>
        prevFeeds.map(feed =>
          feed.id === feedId
            ? { ...feed, likes: feed.likes || 0 + 1, isLiked: true }
            : feed
        )
      );
    }
  }, []);

  // Bookmark a feed
  const bookmarkFeed = useCallback(async (feedId: string) => {
    try {
      await feedService.bookmarkFeed(feedId);
      
      // Update local state optimistically
      setLocalFeeds(prevFeeds =>
        prevFeeds.map(feed =>
          feed.id === feedId
            ? { ...feed, isBookmarked: !feed.isBookmarked }
            : feed
        )
      );
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to bookmark feed');
      // Revert optimistic update on error
      setLocalFeeds(prevFeeds =>
        prevFeeds.map(feed =>
          feed.id === feedId
            ? { ...feed, isBookmarked: !feed.isBookmarked }
            : feed
        )
      );
    }
  }, []);

  // Share a feed
  const shareFeed = useCallback(async (feedId: string): Promise<string> => {
    try {
      const shareableLink = await feedService.shareFeed(feedId);
      return shareableLink;
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to generate share link');
      throw err;
    }
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchFeeds();
    }
  }, [autoFetch, fetchFeeds]);

  return {
    feeds,
    loading,
    error,
    refreshing,
    hasMore,
    currentPage,
    totalFeeds,
    fetchFeeds,
    refreshFeeds,
    likeFeed,
    unlikeFeed,
    bookmarkFeed,
    shareFeed,
    loadMore,
  };
};

export default useFeed;
