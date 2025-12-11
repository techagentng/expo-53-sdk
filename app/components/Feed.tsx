import { COLORS, icons } from "@/constants";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CustomImageSlider from "./CustomImageSlider";
import TextComponent from "./TextComponent";

interface FeedItem {
  id: string | number;
  // Nested user object (preferred structure)
  user?: {
    id?: string | number;
    fullname?: string;
    username?: string;
    profileImage?: any;
  };
  // Flat user data (fallback structure)
  userId?: string | number;
  userFullname?: string;
  userUsername?: string;
  userProfileImage?: any;
  
  // Post content
  image?: string[];
  media?: string[];
  content: string;
  place: string;
  reportType: string;
  createdAt: string;
  updatedAt?: string;
  
  // Engagement metrics
  numOfLike?: number;
  likes?: number;
  upvotes?: number;
  downvotes?: number;
  userVote?: 'up' | 'down' | null;
  numberOfView?: number;
  views?: number;
  comments?: number;
  shares?: number;
  
  // Status
  isLiked?: boolean;
  isBookmarked?: boolean;
  
  // Additional fields
  followUp?: any[] | any;
  tags?: string[];
  title?: string;
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

interface FeedProps {
  item: FeedItem;
}

type RootStackParamList = {
  FeedDetail: { feed: FeedItem };
  ImageScreen: { images: string[] };
};

type FeedScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface FeedProps {
  item: FeedItem;
  onLikePress: (feedId: string, isLiked: boolean) => Promise<{ success: boolean; likes?: number }>;
}

import { upvoteReport, downvoteReport } from '../../services/reportService';

const Feed = ({ item, onLikePress }: FeedProps) => {
  const navigation = useNavigation<FeedScreenNavigationProp>();
  const [isLiked, setIsLiked] = useState(item.isLiked || false);
  const [likeCount, setLikeCount] = useState(item.likes || item.numOfLike || 0);
  const [downvoteCount, setDownvoteCount] = useState(item.downvotes || 0);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(item.userVote || null);
  const [isLoading, setIsLoading] = useState(false);
  const images = item.image || [];

  const handleVote = async (voteType: 'up' | 'down') => {
    if (isLoading) return;
    setIsLoading(true);

    const previousVote = userVote;
    const previousUpvotes = likeCount;
    const previousDownvotes = downvoteCount;

    try {
      // Optimistic update
      if (voteType === 'up') {
        if (previousVote === 'up') {
          // Remove upvote
          setUserVote(null);
          setLikeCount(prev => Math.max(0, prev - 1));
          await upvoteReport(item.id.toString());
        } else {
          // Add or change to upvote
          const newUpvotes = previousVote === 'down' ? previousUpvotes + 2 : previousUpvotes + 1;
          setUserVote('up');
          setLikeCount(newUpvotes);
          setDownvoteCount(prev => previousVote === 'down' ? Math.max(0, prev - 1) : prev);
          await upvoteReport(item.id.toString());
        }
      } else {
        if (previousVote === 'down') {
          // Remove downvote
          setUserVote(null);
          setDownvoteCount(prev => Math.max(0, prev - 1));
          await downvoteReport(item.id.toString());
        } else {
          // Add or change to downvote
          const newDownvotes = previousVote === 'up' ? previousDownvotes + 2 : previousDownvotes + 1;
          setUserVote('down');
          setDownvoteCount(newDownvotes);
          setLikeCount(prev => previousVote === 'up' ? Math.max(0, prev - 1) : prev);
          await downvoteReport(item.id.toString());
        }
      }
    } catch (error) {
      // Revert on error
      console.error('Error processing vote:', error);
      setUserVote(previousVote);
      setLikeCount(previousUpvotes);
      setDownvoteCount(previousDownvotes);
      // Show error message to user
    } finally {
      setIsLoading(false);
    }
  };

  // Safely access user data - handle both nested and flat user data structures
  const user = {
    id: item.user?.id || item.userId,
    fullname: item.user?.fullname || item.userFullname || 'Unknown User',
    username: item.user?.username || item.userUsername || 'user',
    profileImage: item.user?.profileImage || item.userProfileImage
  };
  
  // Log for debugging
  console.log('Rendering feed item:', {
    itemId: item.id,
    userId: user.id,
    username: user.username,
    hasUserData: !!item.user,
    hasFlatData: !!(item.userId || item.userFullname)
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate("FeedDetail", { feed: item })}
      >
        <View style={styles.profileContainer}>
          <Image
            source={user.profileImage ? { uri: user.profileImage } : { uri: 'https://via.placeholder.com/44x45?text=?' }}
            style={styles.profileImg}
          />
          <View style={{ marginLeft: 10 }}>
            <View style={styles.usernameContainer}>
              <Text style={styles.fulName}>{user.fullname}</Text>
              <Text style={styles.usename}>@{user.username}</Text>
              <View style={styles.verify}>
                <Text style={styles.verifyText}>verified</Text>
                <Text style={{ fontSize: 12 }}>✓</Text>
              </View>
            </View>
            <View style={styles.reportDaTim}>
              <Text style={styles.date}>{item.createdAt}</Text>
              <View
                style={{
                  width: 2,
                  height: 14,
                  backgroundColor: COLORS.gray,
                  marginHorizontal: 5,
                }}
              />
              <Text style={{ fontSize: 12, color: "red" }}>📍</Text>
              <Text style={styles.placeStyle}>{item.place}</Text>
            </View>
          </View>
        </View>
        <View style={styles.reporttype}>
          <Text style={styles.reportText}>{item.reportType}</Text>
        </View>
      </TouchableOpacity>
      <View style={{ marginRight: 10 }}>
        <View style={{ paddingHorizontal: 10 }}>
          <TextComponent text={item.content} />
        </View>

        {item.image && item.image.length > 0 && (
          <TouchableOpacity
            onPress={() => navigation.navigate("ImageScreen", { images })}
          >
            <CustomImageSlider
              images={images as any}
              contentContainerStyle={{}}
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.iconContainer}>
        <View style={styles.actionBar}>
          <TouchableOpacity 
            style={[styles.actionButton, userVote === 'up' && styles.activeButton]}
            onPress={() => handleVote('up')}
            disabled={isLoading}
          >
            <Ionicons 
              name="thumbs-up" 
              size={20} 
              color={userVote === 'up' ? COLORS.primary : COLORS.gray} 
            />
            <Text style={[styles.actionText, userVote === 'up' && styles.activeText]}>
              {likeCount}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, userVote === 'down' && styles.downvoteActive]}
            onPress={() => handleVote('down')}
            disabled={isLoading}
          >
            <Ionicons 
              name="thumbs-down" 
              size={20} 
              color={userVote === 'down' ? COLORS.red : COLORS.gray} 
            />
            <Text style={[styles.actionText, userVote === 'down' && styles.downvoteText]}>
              {downvoteCount}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            onPress={() => navigation.navigate("FeedDetail", { feed: item })}
          >
            <Image
              source={icons.swipeicon || undefined}
              style={{
                width: 45,
                height: 45,
                tintColor: "#000000",
              }}
            />
            <Text
              style={{
                fontWeight: "500",
                fontSize: 14,
                marginHorizontal: 3,
                lineHeight: 17,
              }}
            >
              Follow Up
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <TouchableOpacity style={{ width: 20 }}>
            <Ionicons name="bookmark" size={16} color={item.isBookmarked ? COLORS.primary : COLORS.gray} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <TouchableOpacity>
            <Ionicons name="eye" size={16} color={COLORS.gray} />
          </TouchableOpacity>
          <Text
            style={{
              fontWeight: "500",
              fontSize: 14,
              marginHorizontal: 5,
              lineHeight: 17,
            }}
          >
            {item.numberOfView || item.views || 0}
          </Text>
        </View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <TouchableOpacity>
            <Ionicons name="share" size={16} color={COLORS.gray} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    flex: 1,
    backgroundColor: "white",
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingBottom: 10,
    borderBottomColor: COLORS.gray,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
    marginRight: 15,
  },
  activeButton: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  downvoteActive: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  actionText: {
    marginLeft: 4,
    color: COLORS.gray,
  },
  activeText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  downvoteText: {
    color: COLORS.red,
    fontWeight: '600',
  },
  profileContainer: {
    height: 45,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  profileImg: {
    width: 44,
    height: 45,
    borderRadius: 10,
  },
  usernameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  fulName: {
    fontWeight: "600",
    fontSize: 12,
    lineHeight: 19.6,
    color: COLORS.black,
  },
  usename: {
    color: COLORS.gray,
    fontWeight: "600",
    fontSize: 10,
    lineHeight: 16.9,
    marginLeft: 5,
  },
  reportDaTim: {
    flexDirection: "row",
    height: 20,
    alignItems: "center",
  },
  date: {
    fontWeight: "400",
    fontSize: 13,
    lineHeight: 16.8,
    color: COLORS.gray,
  },
  placeStyle: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 19.6,
    color: COLORS.gray,
  },
  reporttype: {
    marginVertical: 15,
    borderWidth: 1.3,
    height: 30,
    width: 120,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
    borderColor: COLORS.primary,
    marginHorizontal: 12,
  },
  reportText: {
    color: COLORS.primary,
    fontWeight: "700",
    textAlign: "center",
  },
  feedContent: {
    textAlign: "left",
    marginBottom: 10,
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 19.6,
    color: "black",
  },
  reportImage: {},
  verify: {
    borderRadius: 10,
    backgroundColor: "#0276FF",
    width: 72,
    height: 23,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    marginLeft: 5,
  },
  verifyText: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "700",
    color: "white",
  },
  reportImg: {
    height: 350,
    width: 410,
    borderRadius: 10,
  },
  iconContainer: {
    paddingTop: 5,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 8,
  },
});

export default Feed;
