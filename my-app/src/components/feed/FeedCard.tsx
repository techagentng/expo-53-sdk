// src/components/feed/FeedCard.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FeedHeader, FeedMedia, FeedActions, FeedFooter } from './index';
import { FeedItem } from '../../types/feed';
import Card from '../ui/Card';

interface FeedCardProps {
  feed: FeedItem;
  onLike?: (id: string) => void;
  onShare?: (id: string) => void;
  onBookmark?: (id: string) => void;
  onPress?: (feed: FeedItem) => void;
}

const FeedCard: React.FC<FeedCardProps> = ({ 
  feed, 
  onLike, 
  onShare, 
  onBookmark,
  onPress 
}) => {
  return (
    <Card style={styles.container}>
      <FeedHeader 
        user={feed.user} 
        timestamp={feed.createdAt}
        location={feed.location}
        onPress={() => onPress?.(feed)}
      />
      
      <FeedMedia media={feed.media} />
      
      <FeedActions 
        likes={feed.likes}
        isLiked={feed.isLiked}
        isBookmarked={feed.isBookmarked}
        onLike={() => onLike?.(feed.id)}
        onShare={() => onShare?.(feed.id)}
        onBookmark={() => onBookmark?.(feed.id)}
      />
      
      <FeedFooter 
        views={feed.views} 
        comments={feed.comments}
        content={feed.content}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
  },
});

export default FeedCard;