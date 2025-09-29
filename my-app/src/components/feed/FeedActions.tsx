// src/components/feed/FeedActions.tsx

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import IconButton from '../ui/IconButton';
import { icons } from '../../constants';

interface FeedActionsProps {
  likes: number;
  isLiked: boolean;
  isBookmarked: boolean;
  onLike: () => void;
  onShare: () => void;
  onBookmark: () => void;
}

const FeedActions: React.FC<FeedActionsProps> = ({
  likes,
  isLiked,
  isBookmarked,
  onLike,
  onShare,
  onBookmark,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.actionGroup}>
        <IconButton
          icon={icons.likeicon}
          onPress={onLike}
          tintColor={isLiked ? '#0E9C67' : '#000'}
          size={24}
        />
        <Text style={styles.actionText}>{likes}</Text>
      </View>

      <View style={styles.actionGroup}>
        <IconButton
          icon={icons.swipeicon}
          onPress={() => {}}
          tintColor="#000"
          size={24}
        />
        <Text style={styles.actionText}>Follow Up</Text>
      </View>

      <View style={styles.actionGroup}>
        <IconButton
          icon={icons.bookmarkicon}
          onPress={onBookmark}
          tintColor={isBookmarked ? '#0E9C67' : '#000'}
          size={20}
        />
      </View>

      <View style={styles.actionGroup}>
        <IconButton
          icon={icons.eyeseenicon}
          onPress={() => {}}
          tintColor="#000"
          size={20}
        />
      </View>

      <View style={styles.actionGroup}>
        <IconButton
          icon={icons.shareicon}
          onPress={onShare}
          tintColor="#000"
          size={20}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
    color: '#000',
  },
});

export default FeedActions;