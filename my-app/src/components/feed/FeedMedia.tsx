// src/components/feed/FeedMedia.tsx

import React from 'react';
import { View, FlatList, Dimensions, StyleSheet } from 'react-native';
import { MediaItem } from '../../types/feed';
import { MediaRenderer } from '../ui';

interface FeedMediaProps {
  media: MediaItem[];
}

const FeedMedia: React.FC<FeedMediaProps> = ({ media }) => {
  if (!media || media.length === 0) {
    return null;
  }

  const screenWidth = Dimensions.get('window').width;
  const numColumns = media.length > 1 ? 2 : 1;

  return (
    <View style={styles.container}>
      <FlatList
        data={media}
        renderItem={({ item }) => (
          <MediaRenderer 
            item={item} 
            containerStyle={[
              styles.mediaItem,
              { width: screenWidth / numColumns }
            ]}
          />
        )}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        scrollEnabled={false}
        contentContainerStyle={styles.mediaContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  mediaContainer: {
    paddingHorizontal: 8,
  },
  mediaItem: {
    aspectRatio: 1,
    margin: 1,
  },
});

export default FeedMedia;