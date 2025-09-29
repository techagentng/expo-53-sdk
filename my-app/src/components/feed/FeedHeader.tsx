// src/components/feed/FeedHeader.tsx

import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { User } from '../../types/feed';
import { icons } from '../../constants';

interface FeedHeaderProps {
  user: User;
  timestamp: string;
  location?: {
    state: string;
    lga: string;
  };
  onPress?: () => void;
}

const FeedHeader: React.FC<FeedHeaderProps> = ({ 
  user, 
  timestamp, 
  location, 
  onPress 
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
      
      <View style={styles.userInfo}>
        <View style={styles.nameRow}>
          <Text style={styles.fullName}>{user.fullname}</Text>
          <Text style={styles.username}>@{user.username}</Text>
          {user.isVerified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>verified</Text>
              <Image 
                source={icons.checkbox} 
                style={styles.verifiedIcon} 
              />
            </View>
          )}
        </View>
        
        <View style={styles.metaRow}>
          <Text style={styles.timestamp}>{timestamp}</Text>
          {location && (
            <>
              <View style={styles.dot} />
              <Image source={icons.hotspots} style={styles.locationIcon} />
              <Text style={styles.location}>
                {location.state}, {location.lga}
              </Text>
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  profileImage: {
    width: 44,
    height: 44,
    borderRadius: 10,
  },
  userInfo: {
    marginLeft: 10,
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  fullName: {
    fontWeight: '600',
    fontSize: 12,
    color: '#000',
  },
  username: {
    color: '#666',
    fontWeight: '600',
    fontSize: 10,
    marginLeft: 5,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0276FF',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 5,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'white',
    marginRight: 4,
  },
  verifiedIcon: {
    width: 12,
    height: 12,
    tintColor: 'white',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 13,
    color: '#666',
  },
  dot: {
    width: 2,
    height: 14,
    backgroundColor: '#666',
    marginHorizontal: 5,
  },
  locationIcon: {
    width: 15,
    height: 15,
    tintColor: 'red',
  },
  location: {
    fontSize: 14,
    color: '#666',
  },
});

export default FeedHeader;