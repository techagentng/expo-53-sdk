// src/components/ui/MediaRenderer.tsx

import React from 'react';
import { Image, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { MediaItem } from '../../types/feed';

interface MediaRendererProps {
  item: MediaItem;
  containerStyle?: any;
  onPress?: (item: MediaItem) => void;
}

const MediaRenderer: React.FC<MediaRendererProps> = ({ 
  item, 
  containerStyle, 
  onPress 
}) => {
  const handlePress = () => {
    onPress?.(item);
  };

  const renderContent = () => {
    switch (item.type) {
      case 'image':
        return (
          <Image
            source={{ uri: item.url }}
            style={styles.media}
            resizeMode="cover"
          />
        );
      
      case 'video':
        return (
          <View style={styles.videoContainer}>
            <Image
              source={{ uri: item.thumbnail || item.url }}
              style={styles.media}
              resizeMode="cover"
            />
            <View style={styles.playButton}>
              <Text style={styles.playButtonText}>▶</Text>
            </View>
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, containerStyle]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  videoContainer: {
    backgroundColor: '#000',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 2,
  },
});

export default MediaRenderer;