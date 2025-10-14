import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  Text,
} from "react-native";
import { Video, ResizeMode } from "expo-av";

const screenWidth = Dimensions.get("window").width;

interface VideoFeedProps {
  url: string | undefined;
}

const VideoFeed = ({ url }: VideoFeedProps) => {
  const [videoFiles, setVideoFiles] = useState<string[]>([]);

  // Helper function to parse feed URLs (split by comma)
  const parseFeedUrls = (feedUrls: string) => {
    if (!feedUrls) return [];
    return feedUrls.split(",").map((url) => url.trim());
  };

  useEffect(() => {
    const processVideos = () => {
      if (url) {
        const parsedMedia = parseFeedUrls(url);
        const validVideos = parsedMedia.filter((url) =>
          url.match(/\.(mp4|mov|m4v)$/)
        );
        setVideoFiles(validVideos); // Set only valid video URLs
      }
    };

    processVideos();
  }, [url]);

  // Render video component
  const renderVideo = ({ item }: { item: string }) => {
    return (
      <View style={styles.videoContainer}>
        <Video
          source={{ uri: item }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode={ResizeMode.COVER}
          shouldPlay={false} // Autoplay is off
          useNativeControls
          style={styles.video}
        />
      </View>
    );
  };

  return (
    <View>
      {videoFiles.length > 0 ? (
        <FlatList
          data={videoFiles}
          renderItem={renderVideo}
          keyExtractor={(item, index) => `${index}`}
          contentContainerStyle={styles.videoListContainer}
        />
      ) : (
        <Text style={styles.noVideosText}>No videos available</Text>
      )}
    </View>
  );
};

export default VideoFeed;

const styles = StyleSheet.create({
  videoListContainer: {
    padding: 10,
  },
  videoContainer: {
    width: screenWidth,
    height: 300,
    marginBottom: 10,
  },
  video: {
    width: "100%",
    height: "100%",
  },
  noVideosText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
});
