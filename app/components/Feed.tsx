import { COLORS, icons } from "@/constants";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CustomImageSlider from "./CustomImageSlider";
import TextComponent from "./TextComponent";

interface FeedItem {
  id: string | number;
  user?: {
    id?: number;
    fullname: string;
    username: string;
    profileImage: any;
  };
  image?: string[];
  createdAt: string;
  place: string;
  reportType: string;
  content: string;
  numOfLike?: number;
  numberOfView?: number;
  followUp?: any[] | any;
  // Additional fields for compatibility
  title?: string;
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
  updatedAt?: string;
  likes?: number;
  comments?: number;
  shares?: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  tags?: string[];
  media?: string[];
  views?: number;
}

interface FeedProps {
  item: FeedItem;
}

type RootStackParamList = {
  FeedDetail: { feed: FeedItem };
  ImageScreen: { images: string[] };
};

type FeedScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const Feed = ({ item }: FeedProps) => {
  const navigation = useNavigation<FeedScreenNavigationProp>();
  const images = item.image || [];

  // Safely access user data
  const user = item.user || {
    fullname: 'Unknown User',
    username: 'unknown',
    profileImage: null
  };

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
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <TouchableOpacity style={{ width: 25, paddingBottom: 2, marginRight: 8 }}>
            <Text style={{ fontSize: 18, color: item.isLiked ? COLORS.primary : COLORS.gray }}>❤️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ width: 25, paddingBottom: 2 }}>
            <Text style={{ fontSize: 18, color: COLORS.gray }}>💔</Text>
          </TouchableOpacity>
          <Text
            style={{
              fontWeight: "500",
              fontSize: 14,
              marginHorizontal: 5,
              lineHeight: 17,
            }}
          >
            {item.numOfLike || item.likes || 0}
          </Text>
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
