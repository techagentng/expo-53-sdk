// src/components/feed/FeedFooter.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TextComponent from '../ui/TextComponent';

interface FeedFooterProps {
  views: number;
  comments: number;
  content: string;
}

const FeedFooter: React.FC<FeedFooterProps> = ({
  views,
  comments,
  content,
}) => {
  return (
    <View style={styles.container}>
      <TextComponent text={content} />
      
      <View style={styles.statsContainer}>
        <Text style={styles.statText}>{views} views</Text>
        {comments > 0 && (
          <>
            <View style={styles.dot} />
            <Text style={styles.statText}>{comments} comments</Text>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  dot: {
    width: 4,
    height: 4,
    backgroundColor: '#666',
    borderRadius: 2,
    marginHorizontal: 8,
  },
});

export default FeedFooter;