import { COLORS, SIZES } from "@/constants";
import { bookmarkPost } from "@/Redux/authSlice";
import type { AppDispatch, RootState } from "@/Redux/store";
import { DOWN_VOTE, UPVOTE } from "@/Redux/URL";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { Audio } from "expo-av";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import TextComponent from "./TextComponent";

const screenWidth = Dimensions.get("window").width;

interface FeedItem {
  id?: string | number;
  user_is_anonymous?: boolean;
  thumbnail_urls?: string;
  fullname?: string;
  username?: string;
  time_of_incidence?: string;
  state_name?: string;
  lga_name?: string;
  category?: string;
  description?: string;
  feed_urls?: string;
  upvote_count?: number;
  downvote_count?: number;
  media_url?: string;
}

interface MediaFile {
  type: "image" | "audio";
  url: string;
}
const ApiFeed = ({ item }: { item: FeedItem }) => {
  const navigation = useNavigation();
  //const images = item.image;
  const [upvote, setupvote] = useState(false);
  const [downvote, setdownvote] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(item?.upvote_count);
  const [downCount, setDownCount] = useState(item?.downvote_count);
  const [voteLoading, setVoteLoading] = useState(false);
  const [downVoteLoading, setDownVoteLoading] = useState(false);
  const [isValidImage, setIsValidImage] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [numColumns, setNumColumns] = useState(1);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const date = item?.time_of_incidence;
  const id = item?.id;

  async function bookmarkfunc(id: string | number | undefined) {
    if (!id) return;
    // The bookmarkPost action will toggle the bookmark state via the API
    dispatch(bookmarkPost({ postId: String(id) }));
  }
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "";

    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const milliseconds = String(date.getMilliseconds()).charAt(0);

    return `${year}-${month}-${day}:${hours}:${minutes}:${seconds}.${milliseconds}`;
  };

  const postId = item?.id;

  async function upVoteClick(postId: string | number | undefined) {
    setupvote((prev) => !prev);
    setdownvote(false);
    setVoteLoading(true);
    if (upvote === false) {
      setUpvoteCount((prevCount = 0) => (prevCount || 0) + 1);
    }
    if (upvote === true && (upvoteCount || 0) > 0) {
      setUpvoteCount((prevCount = 0) => (prevCount || 0) - 1);
    }
    setVoteLoading(false);
    try {
      const token = await AsyncStorage.getItem("access_token");
      const response = await axios.put(UPVOTE + "/" + postId, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      if (response.status === 200) {
      }
    } catch (error: any) {
      setVoteLoading(false);
      setUpvoteCount((prevCount = 0) => (prevCount || 0) - 1);
      if (error.response) {
        console.log("server error:", error.response.data.error);
        const errorMessage = error.response.data.error;
        Alert.alert("Error", errorMessage);
        // return rejectWithValue(error.response.data);
      } else if (error.request) {
        console.log("network error:", error.message);
        Alert.alert(
          "Network error. Please check your internet connection and try again."
        );
        // return rejectWithValue(error.message);
      } else {
        console.log("error:", error.message);
        Alert.alert("An unexpected error occurred. Please try again.");
        // return rejectWithValue(error.message);
      }
    }
  }
  async function downVoteClick(postId: string | number | undefined) {
    setdownvote((prev) => !prev);
    setupvote(false);
    setDownVoteLoading(true);

    try {
      const token = await AsyncStorage.getItem("access_token");
      const response = await axios.put(DOWN_VOTE + "/" + postId, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      if (response.status === 200) {
        setDownVoteLoading(false);
        setDownCount((prevCount = 0) => (prevCount || 0) + 1);
        if (downvote === true && (downCount || 0) > 0) {
          setDownCount((prevCount = 0) => (prevCount || 0) - 1);
        }
      }
    } catch (error: any) {
      setDownVoteLoading(false);
      //setDownCount((prevCount) => prevCount - 1);
      if (error.response) {
        console.log("server error:", error.response.data.error);
        const errorMessage = error.response.data.error;
        Alert.alert("Error", errorMessage);
        // return rejectWithValue(error.response.data);
      } else if (error.request) {
        console.log("network error:", error.message);
        Alert.alert(
          "Network error. Please check your internet connection and try again."
        );
        // return rejectWithValue(error.message);
      } else {
        console.log("error:", error.message);
        Alert.alert("An unexpected error occurred. Please try again.");
        // return rejectWithValue(error.message);
      }
    }
  }

  useEffect(() => {
    if (item?.thumbnail_urls) {
      Image.prefetch(item?.thumbnail_urls)
        .then(() => setIsValidImage(true))
        .catch(() => setIsValidImage(false));
    } else {
      setIsValidImage(false);
    }
  }, [item?.thumbnail_urls]);

  const parseFeedUrls = (feedUrls: string | undefined): string[] => {
    if (!feedUrls) return [];
    const urls = feedUrls.split(",");
    const validMedia = urls.filter((url) =>
      url.match(/\.(jpeg|jpg|gif|png|mp3|wav|ogg)$/)
    );
    return validMedia;
  };

  const playAudio = async (audioUrl: string) => {
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
  const calculateRows = () => {
    if (mediaFiles.length <= 3) return 1;
    return Math.ceil(mediaFiles.length / 2); // 2 media per row after 3 items
  };

  const validateImage = async (imageUrl: string) => {
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
        const validMedia = [];

        for (let url of parsedMedia) {
          if (url.match(/\.(jpeg|jpg|gif|png)$/)) {
            const isLoadable = await validateImage(url);
            if (isLoadable) {
              validMedia.push({ type: "image" as const, url });
            }
          } else if (url.match(/\.(mp3|wav|ogg)$/)) {
            validMedia.push({ type: "audio" as const, url });
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
    const isLastOddImage = mediaFiles.length % 2 !== 0 && index === mediaFiles.length - 1;
  
    if (media.type === "image") {
      return (
        <TouchableOpacity
          onPress={() =>
            (navigation as any).navigate("SingleImage", { imageUrl: media.url })
          }
        >
          <Image
            source={{ uri: media.url }}
            style={isSingleImage || isLastOddImage ? styles.singleImage : styles.image}
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
            <Image source={require("@/assets/images/citizenx.png")} style={styles.profileImg} />
          ) : (
            <Image
              source={
                isValidImage ? { uri: item?.thumbnail_urls } : require("@/assets/images/citizenx.png")
              }
              style={styles.profileImg}
            />
          )}

          <View style={{ marginLeft: 10 }}>
            <View style={styles.usernameContainer}>
              {item?.user_is_anonymous === true ? (
                <Text style={styles.fulName}>Anonymous User</Text>
              ) : item?.fullname ? (
                <Text style={styles.fulName}>{item?.fullname}</Text>
              ) : (
                <Text style={styles.fulName}>Anonymous User</Text>
              )}

              {item?.user_is_anonymous === true ? (
                <Text style={styles.usename}>@Anonymous</Text>
              ) : item?.username ? (
                <Text style={styles.usename}>@{item?.username}</Text>
              ) : (
                <Text style={styles.usename}>@Anonymous</Text>
              )}
            </View>
            <View style={styles.reportDaTim}>
              {item?.time_of_incidence && (
                <Text style={styles.date}>{formatDate(date)}</Text>
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
                <Text style={{ fontSize: 15, color: "red" }}>📍</Text>
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

      <View>
        {mediaFiles.length > 0 && (
          <FlatList
            data={mediaFiles}
            renderItem={renderMedia}
            keyExtractor={(media, index) => index.toString()}
            numColumns={mediaFiles.length > 1 ? 2 : 1}
            key={mediaFiles.length > 1 ? 2 : 1}
            horizontal={false}
            contentContainerStyle={styles.mediaContainer}
          />
        )}
      </View>
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
                onPress={() => upVoteClick(postId)}
              >
                <Image
                  source={require("@/assets/images/citizenx.png")}
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
                onPress={() => downVoteClick(postId)}
              >
                <Image
                  source={require("@/assets/images/citizenx.png")}
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
              source={require("@/assets/images/citizenx.png")}
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
                bookmarkfunc(id);
              }}
            >
              <Image
                source={require("@/assets/images/citizenx.png")}
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
              source={require("@/assets/images/citizenx.png")}
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
  mediaContainer: {
    paddingHorizontal: 10,
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
