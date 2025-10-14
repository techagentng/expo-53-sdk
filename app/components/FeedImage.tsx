import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";

// Helper function to parse feed URLs (split by comma)
const screenWidth = Dimensions.get("window").width;

interface MediaFile {
  type: 'image' | 'audio';
  url: string;
}

interface ReportFeedProps {
  url?: string;
}

type NavigationProp = {
  navigate: (screen: string, params?: any) => void;
};

const ReportFeed: React.FC<ReportFeedProps> = ({ url }) => {
  const navigation = useNavigation<NavigationProp>();

  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [numColumns, setNumColumns] = useState(1);

  const parseFeedUrls = (feedUrls?: string): string[] => {
    if (!feedUrls) return [];
    return feedUrls.split(",").map((url: string) => url.trim()); // Trim spaces and split by comma
  };

  useEffect(() => {
    console.log("unnique id", url);
  }, []);
  // Function to validate if an image URL is loadable
  const validateImage = async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url, { method: "HEAD" });
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  // Function to process the media URLs
  useEffect(() => {
    const processMedia = async () => {
      if (url) {
        console.log("Processing URLs:", url);
        const parsedMedia = parseFeedUrls(url);
        const validMedia: MediaFile[] = [];

        for (let mediaUrl of parsedMedia) {
          if (mediaUrl.match(/\.(jpeg|jpg|gif|png)$/)) {
            const isLoadable = await validateImage(mediaUrl);
            if (isLoadable) {
              validMedia.push({ type: "image" as const, url: mediaUrl });
            }
          } else if (mediaUrl.match(/\.(mp3|wav|ogg)$/)) {
            validMedia.push({ type: "audio" as const, url: mediaUrl });
          }
        }

        setMediaFiles(validMedia); // Update the mediaFiles state
        setNumColumns(validMedia.length > 1 ? 2 : 1); // Adjust number of columns based on items
      }
    };

    processMedia();
  }, [url]);

  // Render function for media items
  const renderMedia = ({ item, index }: { item: MediaFile; index: number }) => {
    if (!item || !item.url) {
      return null;
    }
    const isSingleImage = mediaFiles.length === 1;
    const isLastOddImage =
      mediaFiles.length % 2 !== 0 && index === mediaFiles.length - 1;

    if (item.type === "image") {
      return (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("SingleImage", { imageUrl: item.url })
          }
        >
          <Image
            source={{ uri: item.url }}
            style={
              isSingleImage || isLastOddImage
                ? styles.singleImage
                : styles.image
            }
          />
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <View>
      {mediaFiles.length > 0 && (
        <FlatList
          data={mediaFiles}
          renderItem={renderMedia}
          keyExtractor={(media, index) => `${index}`} // Unique key using item ID
          numColumns={mediaFiles.length > 1 ? 2 : 1}
          horizontal={false}
          contentContainerStyle={styles.mediaContainer}
        />
      )}
    </View>
  );
};

export default ReportFeed;
const styles = StyleSheet.create({
  singleImage: {
    width: screenWidth,
    height: 300,
    resizeMode: "cover",
  },
  image: {
    width: screenWidth / 2,
    height: 200,
    resizeMode: "cover",
  },
  mediaContainer: {
    paddingHorizontal: 10,
  }
});
