import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFeed } from '@/hooks/useFeed';
import FeedCard from '../components/Feed';
import { COLORS, SIZES } from '@/constants/theme';
import { FeedItem } from '@/app/services/feedService';

interface FeedScreenProps {
  navigation?: any;
  route?: any;
}

const FeedScreen: React.FC<FeedScreenProps> = ({ navigation }) => {
  const {
    feeds,
    loading,
    error,
    refreshing,
    hasMore,
    fetchFeeds,
    refreshFeeds,
    likeFeed,
    unlikeFeed,
    bookmarkFeed,
    shareFeed,
    loadMore,
  } = useFeed({
    autoFetch: true,
    page: 1,
    limit: 20,
  });

  // Handle feed item press
  const handleFeedPress = useCallback((feed: FeedItem) => {
    if (navigation) {
      navigation.navigate('FeedDetail', { feedId: feed.id });
    }
  }, [navigation]);

  // Handle like action
  const handleLike = useCallback(async (feedId: string) => {
    try {
      await likeFeed(feedId);
    } catch (error) {
      Alert.alert('Error', 'Failed to like post. Please try again.');
    }
  }, [likeFeed]);

  // Handle bookmark action
  const handleBookmark = useCallback(async (feedId: string) => {
    try {
      await bookmarkFeed(feedId);
    } catch (error) {
      Alert.alert('Error', 'Failed to bookmark post. Please try again.');
    }
  }, [bookmarkFeed]);

  // Handle share action
  const handleShare = useCallback(async (feedId: string) => {
    try {
      const shareableLink = await shareFeed(feedId);
      // Here you would implement actual sharing functionality
      Alert.alert('Share', `Shareable link: ${shareableLink}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate share link. Please try again.');
    }
  }, [shareFeed]);

  // Render feed item
  const renderFeedItem = useCallback(({ item }: { item: FeedItem }) => (
    <FeedCard
      item={item}
    />
  ), []);

  // Render loading indicator
  const renderLoading = useCallback(() => {
    if (loading && feeds.length === 0) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading feed...</Text>
        </View>
      );
    }
    return null;
  }, [loading, feeds.length]);

  // Render error message
  const renderError = useCallback(() => {
    if (error && feeds.length === 0) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={refreshFeeds}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  }, [error, feeds.length, refreshFeeds]);

  // Render empty state
  const renderEmpty = useCallback(() => {
    if (!loading && !error && feeds.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No feed items yet</Text>
          <Text style={styles.emptySubText}>Pull down to refresh</Text>
        </View>
      );
    }
    return null;
  }, [loading, error, feeds.length]);

  // Render footer for load more
  const renderFooter = useCallback(() => {
    if (!loading || feeds.length === 0) return null;
    
    return (
      <View style={styles.footerContainer}>
        <ActivityIndicator size="small" color={COLORS.primary} />
        <Text style={styles.footerText}>Loading more...</Text>
      </View>
    );
  }, [loading, feeds.length]);

  // Handle end reached for pagination
  const handleEndReached = useCallback(() => {
    if (hasMore && !loading && !refreshing) {
      loadMore();
    }
  }, [hasMore, loading, refreshing, loadMore]);

  return (
    <View style={styles.container}>
      <FlatList
        data={feeds}
        renderItem={renderFeedItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.feedList}
        showsVerticalScrollIndicator={false}
        
        // Pull to refresh
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshFeeds}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        
        // Loading states
        ListHeaderComponent={
          <>
            {renderLoading()}
            {renderError()}
            {renderEmpty()}
          </>
        }
        ListFooterComponent={renderFooter}
        
        // Pagination
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        
        // Performance optimizations
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray2,
  },
  feedList: {
    paddingVertical: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.padding * 2,
  },
  loadingText: {
    marginTop: SIZES.base,
    fontSize: SIZES.body4,
    color: COLORS.darkGray,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.padding * 2,
  },
  errorText: {
    fontSize: SIZES.body4,
    color: COLORS.red,
    textAlign: 'center',
    marginBottom: SIZES.base,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: SIZES.body4,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.padding * 2,
  },
  emptyText: {
    fontSize: SIZES.h3,
    color: COLORS.darkGray,
    fontWeight: '600',
  },
  emptySubText: {
    fontSize: SIZES.body4,
    color: COLORS.gray,
    marginTop: SIZES.base / 2,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.padding,
  },
  footerText: {
    marginLeft: SIZES.base,
    fontSize: SIZES.body4,
    color: COLORS.darkGray,
  },
});

export default FeedScreen;
