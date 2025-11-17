import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Dimensions,
  FlatList,
  Modal,
  Share,
  ScrollView,
  TextInput,
  BackHandler,
} from "react-native";
import { COLORS, icons, SIZES } from "@/constants";
import TextComponent from "./TextComponent";
import ErrorBoundary from "./ErrorBoundary";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DOWN_VOTE,
  REPORT_POST,
  UPVOTE,
  REPORT_USER,
  BOOKMARK_FEED,
  FOLLOW_REPORT,
  CREATE_REPORT,
} from "@/Redux/URL";
import { Audio, Video, ResizeMode } from "expo-av";
import { bookmarkPost } from "@/Redux/authSlice";
import TextButton from "./TextButton";
import VideoImage from "./VideoImage";
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import ThumbsUpIcon from './icons/ThumbsUpIcon';
import ThumbsDownIcon from './icons/ThumbsDownIcon';
import FollowUpIcon from './icons/FollowUpIcon';
import BookmarkIcon from './icons/BookmarkIcon';
import ShareIcon from './icons/ShareIcon';

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
  full_size_urls?: string;
  upvote_count?: number;
  downvote_count?: number;
  media_url?: string;
  user_id?: string | number;
  user_fullname?: string;
  user_username?: string;
  is_verified?: boolean;
  follow_up_count?: number;
}

interface MediaItem {
  type: "image" | "video" | "audio";
  url: string;
}

const ApiFeed = ({ item }: { item: FeedItem }) => {
  // Defensive: validate item
  if (!item || typeof item !== 'object' || !item.id) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
        <Text style={{ color: 'red', fontSize: 18, textAlign: 'center', margin: 20 }}>
          Unable to load post. Post data is missing or invalid.
        </Text>
      </View>
    );
  }
  // Using Expo Router instead of React Navigation
  //const images = item.image;
  const [upvote, setupvote] = useState(false);
  const [downvote, setdownvote] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(item?.upvote_count);
  const [downCount, setDownCount] = useState(item?.downvote_count);
  const [voteLoading, setVoteLoading] = useState(false);
  const [downVoteLoading, setDownVoteLoading] = useState(false);
  const [isValidImage, setIsValidImage] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<MediaItem[]>([]);
  const [numColumns, setNumColumns] = useState(1);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [errorModal, setErrorModal] = useState(false);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [bookmarkclick, setBookmarkClick] = useState(false);
  const dispatch = useDispatch<any>();
  const { bookmarkLoading, bookmarkError, bookmarkedPosts, user } = useSelector((state: any) => state.auth);
  const [followUpComment, setFollowUpComment] = useState("");
  const [followUpMedia, setFollowUpMedia] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUserPost, setIsUserPost] = useState(false);
  const [followUpCount, setFollowUpCount] = useState(0);

  // Load follow-up count from AsyncStorage when component mounts
  useEffect(() => {
    const loadFollowUpCount = async () => {
      try {
        const storedCount = await AsyncStorage.getItem(`followUpCount_${item.id}`);
        if (storedCount !== null) {
          setFollowUpCount(parseInt(storedCount, 10));
        }
      } catch (error: any) {
        console.error('Error loading follow-up count:', error);
      }
    };

    loadFollowUpCount();
  }, [item.id]);

  // Save follow-up count to AsyncStorage whenever it changes
  useEffect(() => {
    const saveFollowUpCount = async () => {
      try {
        await AsyncStorage.setItem(`followUpCount_${item.id}`, followUpCount.toString());
      } catch (error: any) {
        console.error('Error saving follow-up count:', error);
      }
    };

    saveFollowUpCount();
  }, [followUpCount, item.id]);

  // const { bookmarkLoading, bookmarkError } = useSelector((state: any) => state.auth);

  const date = item?.time_of_incidence;
  const id = item?.id;

  useEffect(() => {
    // Set initial bookmark state based on Redux store
    const isBookmarked = bookmarkedPosts[item?.id as string] || false;
    setBookmarkClick(isBookmarked);
  }, [item?.id, bookmarkedPosts]);

  useEffect(() => {
    if (loading) {
      setLoadingModal(true);
    } else if (loading === false) {
      setLoadingModal(false);
    }
  }, [loading, loadingModal]);

  useEffect(() => {
    // Check if the post belongs to the current user
    if (!user || !item) {
      console.log('Missing required data:', { hasUser: !!user, hasItem: !!item });
      setIsUserPost(false);
      return;
    }

    const userId = user?.id?.toString();
    const postUserId = item?.user_id?.toString();

    // Log user and post data for debugging
    console.log('User Data:', {
      id: userId,
      username: user?.username,
      fullname: user?.fullname,
      profileImage: user?.profile_image
    });

    console.log('Post Data:', {
      id: item?.id,
      userId: postUserId,
      userFullname: item?.fullname
    });

    // Only check ownership if both IDs exist
    if (userId && postUserId) {
      const isOwner = userId === postUserId;
      console.log('Post Ownership Check:', {
        userId,
        postUserId,
        isOwner
      });
      setIsUserPost(isOwner);
    } else {
      console.log('Missing User Data:', {
        hasUserId: !!userId,
        hasPostUserId: !!postUserId
      });
      setIsUserPost(false);
    }
  }, [user, item?.user_id]);

  function handleError(error: any) {
    if (error.response) {
      console.log("Server error:", error.response.data.error);
      const errorMessage = error.response.data.error;
      Alert.alert("Error", errorMessage);
    } else if (error.request) {
      console.log("Network error:", error.message);
      Alert.alert(
        "Network error. Please check your internet connection and try again."
      );
    } else {
      console.log("Error:", error.message);
      Alert.alert("An unexpected error occurred. Please try again.");
    }
  }

  async function bookmarkfunc(id: string | number) {
    try {
      const access_token = await AsyncStorage.getItem("access_token");
      const response = await axios.get(`${BOOKMARK_FEED}/${id}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      // Dispatch the bookmark action to update Redux store
      dispatch(bookmarkPost({ postId: id.toString() }));

      // Update local state
      setBookmarkClick(!bookmarkclick);
      return response.data.message;
    } catch (error: any) {
      if (error.response?.data?.error?.includes("already bookmarked")) {
        setBookmarkClick(true);
        dispatch(bookmarkPost({ postId: String(id) }));
      }
      handleError(error);
    }
  }
  async function reportPost(id: string | number, message: string) {
    try {
      setLoading(true);
      const formatDate = new FormData();
      formatDate.append("message", message);
      const response = await axios.put(
        `${REPORT_POST}/${id}`,
        {
          message: message,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      setLoading(false);
      router.push("/ComplainSuccess" as any);
    } catch (error: any) {
      console.log(error);
      // setLoading(false);
      //handleError(error);
    } finally {
      setLoading(false);
      router.push("/ComplainSuccess" as any);
    }
  }

  async function reportUser(userId: string | number) {
    try {
      setLoading(true);

      const response = await axios.put(`${REPORT_USER} / ${userId}`, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);
      setLoading(false);
      router.push("/ComplainSuccess" as any);
    } catch (error: any) {
      //setLoading(false);
      //handleError(error);
    } finally {
      setLoading(false);
      router.push("/ComplainSuccess" as any);
    }
  }
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    // Format date
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    
    // Format time
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const postId = item?.id;

  const toggleModal = () => {
    setModal(!modal);
  };

  async function upVoteClick(postId: string | number | undefined) {
    // If already upvoted, do nothing
    if (upvote) return;
    
    setupvote(true);
    setdownvote(false);
    setVoteLoading(true);

    // If switching from downvote to upvote, adjust counts accordingly
    if (downvote) {
      setDownCount(prevCount => Math.max(0, prevCount || 0 - 1));
    }
    setUpvoteCount(prevCount => prevCount || 0 + 1);

    try {
      const token = await AsyncStorage.getItem("access_token");
      const response = await axios.put(`${UPVOTE}/${postId}`, {}, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        console.log("Upvote successful");
      }
    } catch (error: any) {
      setVoteLoading(false);
      // Revert the counts if the API call fails
      setUpvoteCount(prevCount => Math.max(0, prevCount || 0 - 1));
      if (downvote) {
        setDownCount(prevCount => prevCount || 0 + 1);
      }
      setupvote(false);
      setdownvote(downvote); // Restore downvote state
      handleError(error);
    } finally {
      setVoteLoading(false);
    }
  }

  async function downVoteClick(postId: string | number | undefined) {
    // If already downvoted, do nothing
    if (downvote) return;
    
    setdownvote(true);
    setupvote(false);
    setDownVoteLoading(true);

    // If switching from upvote to downvote, adjust counts accordingly
    if (upvote) {
      setUpvoteCount(prevCount => Math.max(0, prevCount || 0 - 1));
    }
    setDownCount(prevCount => prevCount || 0 + 1);

    try {
      const token = await AsyncStorage.getItem("access_token");
      const response = await axios.put(`${DOWN_VOTE}/${postId}`, {}, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        console.log("Downvote successful");
      }
    } catch (error: any) {
      setDownVoteLoading(false);
      // Revert the counts if the API call fails
      setDownCount(prevCount => Math.max(0, prevCount || 0 - 1));
      if (upvote) {
        setUpvoteCount(prevCount => prevCount || 0 + 1);
      }
      setdownvote(false);
      setupvote(upvote); // Restore upvote state
      handleError(error);
    } finally {
      setDownVoteLoading(false);
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

  const parseFeedUrls = (feedUrls: string) => {
    if (!feedUrls) return [];
    const urls = feedUrls.split(",");
    const validMedia = urls.filter((url) =>
      url.match(/\.(jpeg|jpg|gif|png|mp3|wav|ogg|mp4|mov|avi)$/)
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
    return Math.ceil(mediaFiles.length / 2);
  };

  const validateImage = async (imageUrl: string) => {
    try {
      await Image.prefetch(imageUrl);
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const processMedia = async () => {
      if (item?.full_size_urls as string) {
        const parsedMedia = parseFeedUrls(item.full_size_urls as string);
        const validMedia = [];

        for (let url of parsedMedia) {
          if (url.match(/\.(jpeg|jpg|gif|png)$/)) {
            const isLoadable = await validateImage(url);
            if (isLoadable) {
              validMedia.push({ type: "image", url });
            }
          } else if (url.match(/\.(mp4|mov|avi)$/)) {
            validMedia.push({ type: "video", url });
          } else if (url.match(/\.(mp3|wav|ogg)$/)) {
            validMedia.push({ type: "audio", url });
          }
        }

        setMediaFiles(validMedia as never[]);
        setNumColumns(validMedia.length > 1 ? 2 : 1);
      }
    };

    processMedia();
  }, [item?.feed_urls]);

  const renderMedia = ({ item: media, index, ...rest }: { item: MediaItem; index: number; rest: any }) => {
    // Defensive: log and validate media
    console.log('renderMedia input:', { media, index });
    const { ...safeRest } = rest;
    if (!media || typeof media !== 'object' || !media.url) {
      return (
        <View style={{ padding: 8 }}>
          <Text style={{ color: 'red' }}>Invalid media</Text>
        </View>
      );
    }
    const isSingleImage = mediaFiles.length === 1;
    const isLastOddImage = mediaFiles.length % 2 !== 0 && index === mediaFiles.length - 1;

    if (media.type === "image") {
      return (
        <TouchableOpacity
          onPress={() => router.push("/" as any)}
        >
          <Image
            source={{ uri: media.url }}
            style={isSingleImage || isLastOddImage ? styles.singleImage : styles.image}
          />
        </TouchableOpacity>
      );
    } else if (media.type === "audio") {
      return (
        <TouchableOpacity style={styles.audioContainer} onPress={() => playAudio(media.url)}>
          <Text style={styles.audioText}>Play Audio</Text>
        </TouchableOpacity>
      );
    } else if (media.type === "video") {
      return (
        <View style={styles.videoContainer}>
          <Video
            source={{ uri: media.url }}
            style={styles.reportVideo}
            useNativeControls
            resizeMode={ResizeMode.COVER}
            isLooping={false}
          />
        </View>
      );
    }
    // Fallback for unsupported media
    return (
      <View style={{ padding: 8 }}>
        <Text style={{ color: 'red' }}>Unsupported media type</Text>
      </View>
    );
  };

  const sharePost = async () => {
    try {
      // Get the first media from the processed mediaFiles
      const firstMedia = mediaFiles[0];
      
      // Generate shareable link using the preview endpoint
      const postId = item?.id;
      const shareableLink = `https://citizenx.ng/preview/post/${postId}`;
      
      // Construct the share message
      let shareMessage = "From CitizenX Report:\n\n";
      shareMessage += item.description + "\n\n";
      shareMessage += `View on CitizenX: ${shareableLink}`;
      
      if (firstMedia && firstMedia.url) {
        // Share both the image and the link
        const result = await Share.share({
          message: shareMessage,
          url: firstMedia.url
        }, {
          dialogTitle: "Share CitizenX Report",
        });

        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            console.log(`Shared via ${result.activityType}`);
          } else {
            console.log('Shared successfully');
          }
        } else if (result.action === Share.dismissedAction) {
          console.log('Share dismissed');
        }
      } else {
        // If no media, just share the text and link
        const result = await Share.share({
          message: shareMessage,
          title: "CitizenX Report"
        });

        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            console.log(`Shared via ${result.activityType}`);
          } else {
            console.log('Shared successfully');
          }
        } else if (result.action === Share.dismissedAction) {
          console.log('Share dismissed');
        }
      }
    } catch (error: any) {
      console.error('Share error:', error);
      Alert.alert("Error", "Failed to share the post. Please try again.");
    }
  };

  const pickMedia = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant media library permissions to attach media.');
        return;
      }

      // Pick the media
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"] as any,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setFollowUpMedia(result.assets[0]);
      }
    } catch (error: any) {
      console.error('Error picking media:', error);
      Alert.alert('Error', 'Failed to pick media. Please try again.');
    }
  };

  const handleFollowUpSubmit = async () => {
    if (!followUpComment.trim()) {
      Alert.alert('Error', 'Please write a follow up report');
      return;
    }

    setIsSubmitting(true);

    try {
      const access_token = await AsyncStorage.getItem('access_token');
      if (!access_token) {
        Alert.alert(
          'Authentication Required',
          'Please login to submit a follow-up report',
          [
            {
              text: 'Login',
              onPress: () => router.push("/onboarding" as any),
            },
            {
              text: 'Cancel',
              onPress: () => setErrorModal(false),
              style: 'cancel',
            },
          ]
        );
        setIsSubmitting(false);
        return;
      }

      // Create form data
      const formData = new FormData();
      formData.append('followText', followUpComment.trim());

      // Append media if selected
      if (followUpMedia) {
        const fileType = followUpMedia.uri.endsWith('.mp4') ? 'video/mp4' : 'image/jpeg';
        formData.append('followMedia', {
        uri: followUpMedia.uri,
        type: fileType,
        name: followUpMedia.uri.split('/').pop()
      } as any);
      }

      // Make the API call
      const response = await axios.post(
        `${FOLLOW_REPORT}/${item.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${access_token}`,
          },
        }
      );

      if (response.status === 200) {
        Alert.alert('Success', 'Follow up report submitted successfully');
        setFollowUpComment('');
        setFollowUpMedia(null);
        setErrorModal(false);
        setFollowUpCount(prevCount => prevCount + 1);
      }
    } catch (error: any) {
      console.error('Error submitting follow-up:', error);
      if (error.response) {
        console.error('Server error details:', error.response.data);
        if (error.response.status === 401) {
          Alert.alert(
            'Session Expired',
            'Your session has expired. Please login again.',
            [
              {
                text: 'Login',
                onPress: () => router.push("/onboarding" as any),
              },
              {
                text: 'Cancel',
                onPress: () => setErrorModal(false),
                style: 'cancel',
              },
            ]
          );
        } else {
          Alert.alert('Error', error.response.data.message || 'Failed to submit follow-up report');
        }
      } else if (error.request) {
        Alert.alert('Error', 'Network error. Please check your internet connection and try again.');
      } else {
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async () => {
    try {
      setLoading(true);
      const access_token = await AsyncStorage.getItem('access_token');
      const response = await axios.delete(
        `${CREATE_REPORT}/${item.id}`,
        {
          headers: {
            'Authorization': `Bearer ${access_token}`,
          },
        }
      );

      if (response.status === 200) {
        Alert.alert('Success', 'Post deleted successfully');
        setModal(false);
        // You might want to refresh the feed here
      }
    } catch (error: any) {
      console.error('Error deleting post:', error);
      Alert.alert(
        'Error',
        error.response?.data?.error || 'Failed to delete post. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Monitor errorModal state changes
  useEffect(() => {
    if (errorModal) {
      console.log('Modal opened');
      // Ensure we're preventing any navigation when modal is open
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        setErrorModal(false);
        return true;
      });
      
      return () => backHandler.remove();
    }
  }, [errorModal]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          //navigation.navigate("ApiFeedDetail", { feed: item });
        }}
      >
        <View style={[styles.profileContainer, { position: "relative" }]}>
          {isUserPost ? (
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 0,
                right: 8,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingRight: 8,
              }}
              onPress={() => setModal(true)}
            >
              <Image
                source={require("@/assets/images/citizenx.png")}
                style={{
                  width: 24,
                  height: 24,
                  tintColor: COLORS.primary,
                }}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 0,
                right: 8,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingRight: 8,
              }}
              onPress={() => setModal(true)}
            >
              <Text style={{ fontWeight: "800", fontSize: 35, lineHeight: 35 }}>.</Text>
              <Text style={{ fontWeight: "800", fontSize: 35, lineHeight: 35 }}>.</Text>
              <Text style={{ fontWeight: "800", fontSize: 35, lineHeight: 35 }}>.</Text>
            </TouchableOpacity>
          )}

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
              {item?.is_verified === false ? (
                <View
                  style={{
                    marginLeft: 20,
                    width: "auto",
                    height: "auto",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#640303",
                    padding: 5,
                    borderRadius: 50,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "600",
                      fontSize: 10,
                      lineHeight: 12,
                      color: COLORS.white2,
                    }}
                  >
                    Not verified
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    marginLeft: 30,
                    width: "auto",
                    height: "auto",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: COLORS.primary,
                    padding: 5,
                    borderRadius: 50,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "600",
                      fontSize: 10,
                      lineHeight: 12,
                      color: COLORS.white2,
                    }}
                  >
                    verified post
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.reportDaTim}>
              {item?.time_of_incidence && (
                <Text style={styles.date}>
                  {
                    //item?.date_of_incidence
                    formatDate(item?.time_of_incidence)
                  }
                </Text>
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
                onPress={() => upVoteClick(postId)}
              >
                <ThumbsUpIcon
                  size={28}
                  color={upvote === false ? "#000000" : "#114833"}
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
                <ThumbsDownIcon
                  size={28}
                  color={downvote === false ? "#000000" : "#9D0404"}
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
              position: 'relative',
            }}
            onPress={(e) => {
              try {
                // Prevent any default navigation
                if (e && e.preventDefault) {
                  e.preventDefault();
                }
                
                console.log('Follow-up button pressed');
                
                // Check if the item exists
                if (!item || !item.id) {
                  console.error('Invalid item data:', item);
                  Alert.alert('Error', 'Unable to create follow-up. Please try again.');
                  return;
                }
                
                setErrorModal(true);
                console.log('ErrorModal state set to true');
              } catch (error: any) {
                console.error('Error showing follow-up modal:', error);
                Alert.alert('Error', 'Unable to show follow-up form. Please try again.');
                // Prevent default navigation
                return false;
              }
            }}
          >
            <View style={{ position: 'relative' }}>
              <FollowUpIcon
                size={32}
                color="#000000"
              />
              {followUpCount > 0 && (
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>{followUpCount}</Text>
                </View>
              )}
            </View>
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
            paddingRight: 8,
          }}
        >
          <TouchableOpacity
            style={{ width: 20, marginRight: 16 }}
            onPress={() => {
              bookmarkfunc(item?.id || "");
            }}
          >
            <BookmarkIcon
              size={22}
              color={bookmarkclick ? "#007AFF" : "#000000"}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={sharePost}>
            <ShareIcon
              size={20}
              color="#000000"
            />
          </TouchableOpacity>
        </View>
      </View>
      <Modal animationType="slide" transparent={true} visible={modal}>
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              width: "100%",
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
              borderWidth: 1.5,
              borderColor: COLORS.gray2,
              backgroundColor: COLORS.lightGray2,
              padding: 20,
            }}
          >
            <TouchableOpacity
              style={{
                marginLeft: "auto",
                marginBottom: 10,
              }}
              onPress={() => setModal(false)}
            >
              <Text style={{ fontSize: 13, color: "#000" }}>✕</Text>
            </TouchableOpacity>

            {isUserPost ? (
              <View
                style={{
                  width: "95%",
                  alignSelf: "center",
                  backgroundColor: COLORS.white2,
                  borderWidth: 1.5,
                  padding: 20,
                  borderColor: COLORS.gray2,
                  borderRadius: 12,
                }}
              >
                <Text style={[styles.titleReport, { marginBottom: 12 }]}>Delete Post</Text>
                <Text style={[styles.subTitleReport, { marginBottom: 20 }]}>
                  Are you sure you want to delete this post?
                </Text>
                <TouchableOpacity
                  style={[styles.containerReport, { 
                    borderColor: 'red',
                    backgroundColor: '#FFF1F0',
                    marginBottom: 0
                  }]}
                  onPress={handleDeletePost}
                >
                  <Text style={[styles.inquires, { color: 'red', textAlign: 'center' }]}>Delete My Post</Text>
                  <Text style={[styles.subInquires, { textAlign: 'center', color: '#666' }]}>
                    This action cannot be undone. All data associated with this post will be permanently deleted.
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={{
                  width: "95%",
                  alignSelf: "center",
                  backgroundColor: COLORS.white2,
                  borderWidth: 1.5,
                  padding: 20,
                  borderColor: COLORS.gray2,
                  borderRadius: 12,
                }}
              >
                <Text style={[styles.titleReport, { marginBottom: 12 }]}>Report Post</Text>
                <Text style={[styles.subTitleReport, { marginBottom: 20 }]}>
                  Please select a reason for reporting this post
                </Text>
                <TouchableOpacity
                  style={styles.containerReport}
                  onPress={() => {
                    const message = "Report Post: Spam or misleading content";
                    reportPost(id, message);
                  }}
                >
                  <Text style={styles.inquires}>Spam or Misleading</Text>
                  <Text style={styles.subInquires}>
                    The post is spam, promotional, or contains false information.
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.containerReport}
                  onPress={() => {
                    const message = "Report Post: Inappropriate content";
                    reportPost(id, message);
                  }}
                >
                  <Text style={styles.inquires}>Inappropriate Content</Text>
                  <Text style={styles.subInquires}>
                    The post contains offensive, harmful, or obscene content.
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.containerReport}
                  onPress={() => {
                    const message = "Report Post: Misinformation";
                    reportPost(id, message);
                  }}
                >
                  <Text style={styles.inquires}>Misinformation</Text>
                  <Text style={styles.subInquires}>
                    The post spreads unverified or misleading information.
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
      <Modal animationType="slide" transparent={true} visible={errorModal}>
        <ErrorBoundary>
          <View style={{ flex: 1 }}>
            {(!item || typeof item !== 'object' || !item.id) ? (
              <View style={[styles.modalContainer, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: 'red', fontSize: 18, textAlign: 'center', margin: 20 }}>Unable to load follow-up form. Post data is missing or invalid.</Text>
                <TouchableOpacity onPress={() => setErrorModal(false)} style={{ marginTop: 16, padding: 12, backgroundColor: COLORS.primary, borderRadius: 8 }}>
                  <Text style={{ color: COLORS.white, fontSize: 16 }}>Close</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.modalContainer}>
                <View style={[styles.modalHeader, { position: 'relative', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }]}>
                  <TouchableOpacity
                    onPress={() => setErrorModal(false)}
                    style={{ position: 'absolute', left: 0, padding: 8 }}
                  >
                    <Text style={{ fontSize: 24, fontWeight: '300', color: '#000' }}>×</Text>
                  </TouchableOpacity>
                  <Text style={styles.modalHeaderTitle}>Create Follow Up Report</Text>
                </View>
                <TextInput
                  style={styles.commentBox}
                  placeholder="Add your follow-up details..."
                  multiline
                  value={followUpComment}
                  onChangeText={setFollowUpComment}
                />
                <View style={styles.mediaRow}>
                  <TouchableOpacity
                    style={[styles.mediaButton, followUpMedia && { flex: 0.7 }]}
                    onPress={pickMedia}
                  >
                    <Text style={{ fontSize: 24, color: "#666", marginRight: 8 }}>📁</Text>
                    <Text style={styles.mediaButtonText}>
                      {followUpMedia ? 'Change Media' : 'Add Media'}
                    </Text>
                  </TouchableOpacity>
                  {followUpMedia && (
                    <View style={styles.thumbnailContainer}>
                      <Image
                        source={{ uri: followUpMedia.uri }}
                        style={styles.thumbnailMedia}
                        resizeMode={ResizeMode.COVER}
                      />
                      <TouchableOpacity
                        style={styles.removeMediaButton}
                        onPress={() => setFollowUpMedia(null)}
                      >
                        <Text style={{ fontSize: 16, color: "white" }}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
                <View style={styles.submitButtonContainer}>
                  <TextButton
                    label={isSubmitting ? "Submitting..." : "Submit Follow Up"}
                    disabled={isSubmitting || !followUpComment.trim()}
                    buttonContainerStyle={{
                      height: 55,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: SIZES.radius,
                      backgroundColor: COLORS.primary,
                      opacity: (!followUpComment.trim() || isSubmitting) ? 0.5 : 1
                    }}
                    labelStyle={{
                      color: COLORS.white,
                      fontWeight: "700",
                      fontSize: 17,
                    }}
                    onPress={() => {
                      try {
                        console.log('Submitting follow up for item:', item);
                        handleFollowUpSubmit();
                      } catch (e) {
                        console.log('Error in handleFollowUpSubmit:', e);
                      }
                    }}
                  />
                </View>
              </View>
            )}
          </View>
        </ErrorBoundary>
      </Modal>
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
  reportImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginBottom: 16,
  },
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
  videoContainer: {
    width: screenWidth,
    height: 300,
    marginBottom: 10,
  },
  reportVideo: {
    width: "100%",
    height: "100%",
  },
  audioText: {
    color: "white",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  contentContainer: {
    flex: 1,
  },
  previewImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalHeaderTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.primary,
  },
  postDetailsContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: COLORS.white,
  },
  userInfoContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userTextContainer: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  userHandle: {
    fontSize: 14,
    color: '#666',
  },
  locationTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  locationIcon: {
    width: 16,
    height: 16,
    tintColor: 'red',
    marginRight: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
  },
  categoryTag: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  categoryText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 8,
  },
  followUpInputContainer: {
    padding: 16,
    backgroundColor: COLORS.white,
    marginTop: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
    color: '#333',
  },
  commentBox: {
    minHeight: 100,
    maxHeight: 150,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#333',
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  submitButtonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  titleReport: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 25,
  },
  subTitleReport: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  inquires: {
    fontSize: 17,
    fontWeight: "600",
    lineHeight: 20,
  },
  subInquires: {
    fontSize: 15,
    fontWeight: "500",
  },
  containerReport: {
    paddingVertical: 12,
    gap: 6,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: COLORS.lightGray1,
    padding: 12,
    marginVertical: 10,
  },
  mediaPreview: {
    marginTop: 12,
    marginBottom: 0,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mediaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  mediaButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    height: 60,
  },
  mediaIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
    tintColor: '#666',
  },
  mediaButtonText: {
    fontSize: 16,
    color: '#666',
  },
  thumbnailContainer: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbnailMedia: {
    width: '100%',
    height: '100%',
  },
  removeMediaButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    padding: 4,
  },
  removeIcon: {
    width: 16,
    height: 16,
    tintColor: 'white',
  },
  badgeContainer: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
