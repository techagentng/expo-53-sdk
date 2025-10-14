import { COLORS, SIZES, icons } from "@/constants";
import { bookmarkPost } from "@/Redux/authSlice";
import type { AppDispatch, RootState } from "@/Redux/store";
import { DOWN_VOTE, UPVOTE } from "@/Redux/URL";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from "axios";
import { Audio } from "expo-av";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import TextComponent from "./TextComponent";
import VideoImage from "./VideoImage";

type RootStackParamList = {
  SingleImage: { imageUrl: string };
  ApiFeedDetail: { feed: FeedItem };
  FeedDetail: { feed: FeedItem };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const screenWidth = Dimensions.get("window").width;

// Icons type is already declared in types/icons.d.ts

interface MediaFile {
  type: 'image' | 'audio';
  url: string;
}

interface FeedItem {
  id?: string | number;
  user_is_anonymous?: boolean;
  profile_image?: string;
  user_fullname?: string;
  user_username?: string;
  date_of_incidence?: string;
  state_name?: string;
  lga_name?: string;
  category?: string;
  description?: string;
  feed_urls?: string;
  upvote_count?: number;
  downvote_count?: number;
}

const ApiFeed = ({ item }: { item: FeedItem }) => {
  const navigation = useNavigation<NavigationProp>();
  //const images = item.image;
  const [upvote, setupvote] = useState(false);
  const [downvote, setdownvote] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(item?.upvote_count);
  const [voteLoading, setVoteLoading] = useState(false);
  const [downVoteLoading, setDownVoteLoading] = useState(false);
  const [downCount, setDownCount] = useState(item?.downvote_count);
  const [isValidImage, setIsValidImage] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [numColumns, setNumColumns] = useState(1);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const id = item?.id;

  async function bookmarkfunc(id: string | number) {
    const access_token = await AsyncStorage.getItem("access_token");
    dispatch(bookmarkPost({ postId: id.toString() }));
  }
  const formatDate = (dateString: string) => {
    const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (dateOnlyRegex.test(dateString)) {
      return dateString;
    }
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const postId = item?.id;

  async function upVoteClick(postId: string | number) {
    setdownvote(false);
    setVoteLoading(true);
    if (upvote === false) {
      setUpvoteCount((prevCount) => (prevCount || 0) + 1);
    }
    if (upvote === true && (upvoteCount || 0) > 0) {
      setUpvoteCount((prevCount) => (prevCount || 0) - 1);
    }
    setVoteLoading(false);
    try {
      const token = await AsyncStorage.getItem("access_token");
      const data = {
        postId: postId,
        vote: 1,
      };
      const response = await axios.put(UPVOTE + "/" + postId, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
      }
    } catch (error: any) {
      setVoteLoading(false);
      setUpvoteCount((prevCount) => (prevCount || 0) - 1);
      if (error.response) {
        const errorMessage = error.response.data.error;
        Alert.alert("Error", errorMessage);
      } else if (error.request) {
        Alert.alert(
          "Network error. Please check your internet connection and try again."
        );
      } else {
        Alert.alert("An unexpected error occurred. Please try again.");
      }
    }
  }
  async function downVoteClick(postId: string | number) {
    setdownvote((prev) => !prev);
    setupvote(false);
    setDownVoteLoading(true);
    
    if (downvote === false) {
      setDownCount((prevCount) => (prevCount || 0) + 1);
    }
    if (downvote === true && (downCount || 0) > 0) {
      setDownCount((prevCount) => (prevCount || 0) - 1);
    }

    try {
      const token = await AsyncStorage.getItem("access_token");
      const data = {
        postId: postId,
        vote: -1,
      };
      const response = await axios.put(DOWN_VOTE + "/" + postId, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setDownVoteLoading(false);
        setDownCount((prevCount) => (prevCount || 0) + 1);
        if (downvote === true && (downCount || 0) > 0) {
          setDownCount((prevCount) => (prevCount || 0) - 1);
        }
      }
    } catch (error: any) {
      setDownVoteLoading(false);
      if (error.response) {
        console.log("server error:", error.response.data.error);
        const errorMessage = error.response.data.error;
        Alert.alert("Error", errorMessage);
      } else if (error.request) {
        console.log("network error:", error.message);
        Alert.alert(
          "Network error. Please check your internet connection and try again."
        );
      } else {
        console.log("error:", error.message);
        Alert.alert("An unexpected error occurred. Please try again.");
      }
      // Revert the count if there was an error
      if (!downvote) {
        setDownCount((prevCount) => (prevCount || 0) - 1);
      } else {
        setDownCount((prevCount) => (prevCount || 0) + 1);
      }
    }
  }

  useEffect(() => {
    if (item?.profile_image) {
      Image.prefetch(item?.profile_image)
        .then(() => setIsValidImage(true))
        .catch(() => setIsValidImage(false));
    } else {
      setIsValidImage(false);
    }
  }, [item?.profile_image]);

  const parseFeedUrls = (feedUrls: string): string[] => {
    const urls = feedUrls.split(",");
    const validMedia = urls.filter((url: string) =>
      url.match(/\.(jpeg|jpg|gif|png|mp3|wav|ogg)$/)
    );
    return validMedia;
  };

  const playAudio = async (audioUrl: string): Promise<void> => {
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
    }
    const { sound: newSound } = await Audio.Sound.createAsync({
      uri: audioUrl,
    });
    setSound(newSound);
    await newSound.playAsync();
  };

  // Function to determine how many rows we need
  const calculateRows = (): number => {
    if (mediaFiles.length <= 3) return 1;
    return Math.ceil(mediaFiles.length / 2); // 2 media per row after 3 items
  };

  const validateImage = async (imageUrl: string): Promise<boolean> => {
    try {
      await Image.prefetch(imageUrl);
      return true; // Image is loadable
    } catch {
      return false; // Image failed to load
    }
  };

  useEffect(() => {
    const processMedia = async () => {
      if (item?.feed_urls) {
        const parsedMedia = parseFeedUrls(item.feed_urls);
        const validMedia: MediaFile[] = [];

        for (let url of parsedMedia) {
          if (url.match(/\.(jpeg|jpg|gif|png)$/)) {
            const isLoadable = await validateImage(url);
            if (isLoadable) {
              validMedia.push({ type: 'image', url });
            }
          } else if (url.match(/\.(mp3|wav|ogg)$/)) {
            validMedia.push({ type: 'audio', url });
          }
        }

        setMediaFiles(validMedia);
        setNumColumns(validMedia.length > 1 ? 2 : 1);
      }
    };

    processMedia();
  }, [item?.feed_urls]);

  const renderMedia = ({ item: media, index }: { item: MediaFile; index: number }) => {
    if (!media || !media.url) {
      return null;
    }
    const isSingleImage = mediaFiles.length === 1;
    const isLastOddImage =
      mediaFiles.length % 2 !== 0 && index === mediaFiles.length - 1;

    if (media.type === "image") {
      return (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("SingleImage", { imageUrl: media.url })
          }
        >
          <Image
            source={{ uri: media.url }}
            style={
              isSingleImage || isLastOddImage
                ? styles.singleImage
                : styles.image
            }
          />
        </TouchableOpacity>
      );
    } else if (media.type === "audio") {
      return (
        <TouchableOpacity
          style={styles.audioContainer}
          onPress={() => playAudio(media.url)}
        >
          <Text style={styles.audioText}>Play Audio</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          //navigation.navigate("ApiFeedDetail", { feed: item });
        }}
      >
        <View style={styles.profileContainer}>
          {item?.user_is_anonymous === true ? (
            <Image 
              source={icons.anonymous || require("@/assets/images/citizenx.png")} 
              style={styles.profileImg} 
            />
          ) : (
            <Image
              source={
                isValidImage && item?.profile_image 
                  ? { uri: item.profile_image } 
                  : icons.anonymous || require("@/assets/images/citizenx.png")
              }
              style={styles.profileImg}
            />
          )}

          <View style={{ marginLeft: 10 }}>
            <View style={styles.usernameContainer}>
              {item?.user_is_anonymous === true ? (
                <Text style={styles.fulName}>Anonymous User</Text>
              ) : item?.user_fullname ? (
                <Text style={styles.fulName}>{item?.user_fullname}</Text>
              ) : (
                <Text style={styles.fulName}>Anonymous User</Text>
              )}

              {item?.user_is_anonymous === true ? (
                <Text style={styles.usename}>@Anonymous</Text>
              ) : item?.user_username ? (
                <Text style={styles.usename}>@{item?.user_username}</Text>
              ) : (
                <Text style={styles.usename}>@Anonymous</Text>
              )}
            </View>
            <View style={styles.reportDaTim}>
              {item?.date_of_incidence && (
                <Text style={styles.date}>{formatDate(item.date_of_incidence)}</Text>
              )}

              <View
                style={{
                  width: 2,
                  height: 14,
                  backgroundColor: COLORS.gray,
                  marginHorizontal: 5,
                }}
              />
              {item?.state_name && (
                <Image
                  source={icons.hotspots || require("@/assets/images/citizenx.png")}
                  style={{
                    width: 15,
                    height: 15,
                    tintColor: "red",
                  }}
                />
              )}
              <Text style={{ ...styles.placeStyle, marginRight: 3 }}>
                {item?.state_name}
              </Text>
              <Text style={styles.placeStyle}>{item?.lga_name}</Text>
            </View>
          </View>
        </View>
        {item?.category && (
          <View style={styles.reporttype}>
            <Text style={styles.reportText}>{item?.category}</Text>
          </View>
        )}
      </TouchableOpacity>
      <View style={{ marginRight: 10 }}>
        <View style={{ paddingHorizontal: 10 }}>
          <TextComponent text={item?.description} />
        </View>
      </View>

      {item?.feed_urls && (
        <View>
          <VideoImage url={item?.feed_urls} />
        </View>
      )}
      <View style={styles.iconContainer}>
        <View style={styles.voteContainer}>
          {voteLoading ? (
            <ActivityIndicator size={SIZES.ACTIVITY_INDICATOR} color={`${COLORS.black}`}  />
          ) : (
            <>
              <TouchableOpacity
                style={{
                  width: 25,
                  padding: 5,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => postId && upVoteClick(postId)}
              >
                <Image
                  source={
                    (upvote === false ? icons.upvoteIcon : icons.upVoteClick) || require("@/assets/images/citizenx.png")
                  }
                  style={{
                    width: 28,
                    height: 28,
                    tintColor: "#000000",
                  }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <Text
                style={{
                  fontWeight: "500",
                  fontSize: 16,
                  marginHorizontal: 2,
                  lineHeight: 17,
                }}
              >
                {upvoteCount}
              </Text>
            </>
          )}
          <View
            style={{
              width: 2,
              height: 30,
              alignSelf: "center",
              backgroundColor: COLORS.gray,
            }}
          />
          {downVoteLoading ? (
            <ActivityIndicator size={SIZES.ACTIVITY_INDICATOR} color={`${COLORS.black}`}  />
          ) : (
            <>
              <Text
                style={{
                  fontWeight: "500",
                  fontSize: 16,
                  marginHorizontal: 2,
                  lineHeight: 17,
                }}
              >
                {downCount}
              </Text>
              <TouchableOpacity
                style={{
                  width: 25,
                  padding: 5,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => postId && downVoteClick(postId)}
              >
                <Image
                  source={
                    (downvote === false
                      ? icons.downvoteIcon
                      : icons.downVoteClick) || require("@/assets/images/citizenx.png")
                  }
                  style={{
                    width: 28,
                    height: 28,
                    tintColor: "#000000",
                  }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </>
          )}
        </View>
        <View style={styles.followUpContainer}>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              padding: 5,
            }}
            onPress={() => {
              //navigation.navigate("FeedDetail", { feed: item });
            }}
          >
            <Image
              source={icons.swipeicon || require("@/assets/images/citizenx.png")}
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
                marginRight: 4,
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
          {loading ? (
            <ActivityIndicator size={SIZES.ACTIVITY_INDICATOR} color={`${COLORS.black}`}  />
          ) : (
            <TouchableOpacity
              style={{ width: 20 }}
              onPress={() => {
                id && bookmarkfunc(id);
              }}
            >
              <Image
                source={icons.bookmarkicon || require("@/assets/images/citizenx.png")}
                style={{
                  width: 22,
                  height: 22,
                  tintColor: "#000000",
                }}
              />
            </TouchableOpacity>
          )}
        </View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <TouchableOpacity>
            <Image
              source={icons.shareicon || require("@/assets/images/citizenx.png")}
              style={{
                width: 20,
                height: 20,
                tintColor: "#000000",
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ApiFeed;

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
    fontSize: 11,
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
    height: "auto",
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
    fontSize: 15,
    lineHeight: 18,
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
    height: 20,
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
  voteContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    //backgroundColor: "#d8d8d8",
    padding: 8,
    gap: 5,
    borderRadius: 10,
    height: 40,
    borderWidth: 0.5,
    borderColor: COLORS.gray3,
  },
  followUpContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    //backgroundColor: "#d8d8d8",
    padding: 2,
    //gap: 5,
    borderRadius: 10,
    height: 40,
    borderWidth: 0.5,
    borderColor: COLORS.gray3,
  },
  image: {
    width: screenWidth / 2,
    height: 200,
    resizeMode: "cover",
  },
  singleImage: {
    width: screenWidth,
    height: 300,
    resizeMode: "cover",
  },
  audioContainer: {
    width: screenWidth / 2,
    height: 50,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  audioText: {
    color: "white",
    fontSize: 16,
  },
});
