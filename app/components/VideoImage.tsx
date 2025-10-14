import { ResizeMode, Video } from "expo-av";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const screenWidth = Dimensions.get("window").width;

// ✅ Single clean MediaItem interface
interface MediaItem {
  type: "image" | "video";
  url: string;
}

interface VideoImageProps {
  url?: string;
}

const VideoImage: React.FC<VideoImageProps> = ({ url }) => {
  const [mediaFiles, setMediaFiles] = useState<MediaItem[]>([]);

  const parseFeedUrls = (feedUrls?: string): string[] => {
    if (!feedUrls) return [];
    return feedUrls
      .split(",")
      .map((url) => url.trim())
      .filter((u) => u.length > 0);
  };

  useEffect(() => {
    if (!url) {
      setMediaFiles([]);
      return;
    }

    const parsedMedia = parseFeedUrls(url);
    const validMedia: MediaItem[] = parsedMedia.map((u) => {
      if (u.match(/\.(jpeg|jpg|gif|png)$/i)) {
        return { type: "image", url: u };
      } else if (u.match(/\.(mp4|mov|m4v)$/i)) {
        return { type: "video", url: u };
      }
      return null;
    }).filter((item): item is MediaItem => item !== null);

    setMediaFiles(validMedia);
  }, [url]);

  const renderMedia = ({ item }: { item: MediaItem }) => {
    if (item.type === "image") {
      return (
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: "/SingleImage" as const,
              params: { imageUrl: item.url }
            });
          }}
        >
          <Image source={{ uri: item.url }} style={styles.image} />
        </TouchableOpacity>
      );
    }

    if (item.type === "video") {
      return (
        <View style={styles.videoContainer}>
                    <Video
            source={{ uri: item.url }}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode={"cover" as ResizeMode}
            shouldPlay={false} // no autoplay
            useNativeControls
            style={styles.video}
          />
        </View>
      );
    }

    return null;
  };

  return (
    <View>
      {mediaFiles.length > 0 ? (
        <FlatList
          data={mediaFiles}
          renderItem={renderMedia}
          keyExtractor={(_, index) => index.toString()}
          numColumns={1}
          contentContainerStyle={styles.mediaContainer}
        />
      ) : (
        <Text style={styles.noMediaText}>No media available</Text>
      )}
    </View>
  );
};

export default VideoImage;

const styles = StyleSheet.create({
  mediaContainer: {
    padding: 10,
  },
  image: {
    width: screenWidth,
    height: 300,
    resizeMode: "cover",
    marginBottom: 10,
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
  noMediaText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
});
