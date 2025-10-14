import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { COLORS, SIZES, icons } from "@/constants";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import TextIconButton from "@/components/TextIconButton";

type RootStackParamList = {
  AudioRecordScreen: { setStoredRecording: (recording: string | null) => void };
  CameraScreen: {
    setPhotoUri: (uri: string | null) => void;
    videoMedia: string | null;
    setVideoMedia: (media: string | null) => void;
  };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface CameraVideoMediaProps {
  setAlbums: (albums: string[]) => void;
  setStoredRecording: (recording: string | null) => void;
  setPhotoUri: (uri: string | null) => void;
  videoMedia: string | null;
  setVideoMedia: (media: string | null) => void;
  albums: string[];
}

export default function CameraVideoMedia({
  setAlbums,
  setStoredRecording,
  setPhotoUri,
  videoMedia,
  setVideoMedia,
  albums,
}: CameraVideoMediaProps) {
  const navigation = useNavigation<NavigationProp>();

  const [imageLoading, setImageLoading] = useState(false);

  const mediaAccess = async () => {
    try {
      setImageLoading(true);
      let result = await ImagePicker.launchImageLibraryAsync({
        quality: 1,
        allowsMultipleSelection: true,
      });

      if (!result.canceled) {
        const selectedImages = result.assets.map((asset) => asset.uri);
        setAlbums(selectedImages);
        setImageLoading(false);
      } else {
        Alert.alert("You did not select any images.");
        setImageLoading(false);
      }
    } catch (error) {
      Alert.alert("Error accessing media library", error instanceof Error ? error.message : String(error));
      setImageLoading(false);
    }
  };

  const renderImage = ({ item }: { item: string }) => (
    <Image
      source={{ uri: item }}
      style={{
        width: 80,
        height: 80,
        marginRight: 10,
        borderRadius: SIZES.radius,
      }}
    />
  );

  return (
    <View style={{ justifyContent: "flex-start", marginVertical: 15 }}>
      <Text style={{ marginVertical: 5, fontSize: 14 }}>Add Media</Text>
      {imageLoading ? (
        <View
          style={{
            height: 40,
            alignItems: "center",
            justifyContent: "center",
            marginTop: SIZES.radius,
            borderRadius: SIZES.radius,
            backgroundColor: "#0585FA",
            width: 160,
          }}
        >
          <ActivityIndicator size={SIZES.ACTIVITY_INDICATOR} color={COLORS.white} />
        </View>
      ) : (
        <TextIconButton
          containerStyle={{
            height: 40,
            alignItems: "center",
            justifyContent: "center",
            marginTop: SIZES.radius,
            borderRadius: SIZES.radius,
            backgroundColor: "#0585FA",
            width: 160,
          }}
          icon={require("@/assets/images/citizenx.png")}
          iconPosition="LEFT"
          iconStyle={{
            tintColor: "white",
            width: 25,
            resizeMode: "cover",
            height: 17,
          }}
          label="Upload Media"
          labelStyle={{
            marginLeft: SIZES.radius,
            color: "white",
          }}
          onPress={mediaAccess}
        />
      )}

      <TextIconButton
        disabled={imageLoading}
        containerStyle={{
          height: 40,
          alignItems: "center",
          justifyContent: "center",
          marginTop: SIZES.radius,
          borderRadius: SIZES.radius,
          backgroundColor: "#0585FA",
          width: 160,
        }}
        icon={require("@/assets/images/citizenx.png")}
        iconPosition="LEFT"
        iconStyle={{
          tintColor: "white",
          width: 19,
          resizeMode: "cover",
          height: 25,
        }}
        label="Record Audio"
        labelStyle={{
          marginLeft: SIZES.radius,
          color: "white",
        }}
        onPress={() =>
          navigation.navigate("AudioRecordScreen", { setStoredRecording })
        }
      />

      {albums.length > 0 && (
        <View style={{ marginTop: 15 }}>
          <FlatList
            data={albums}
            renderItem={renderImage}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  );
}
