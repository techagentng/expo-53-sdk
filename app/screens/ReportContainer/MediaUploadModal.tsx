import React, { useState } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  Text,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Video, ResizeMode } from 'expo-av';

import TextButton from '../../components/TextButton';
import TextIconButton from '../../components/TextIconButton';
import CustomActivityIndicator from '../../components/CustomActivityIndicator';

import { COLORS, icons, SIZES } from '@/constants';

export interface MediaFile {
  uri: string;
  type: 'image' | 'video';
  fileName: string;
}

interface MediaUploadModalProps {
  visible: boolean;
  onClose: () => void;
  onMediaSelected: (media: MediaFile[]) => void;
  maxFiles?: number;
  allowedTypes?: ('image' | 'video')[];
  title?: string;
  description?: string;
}

const MediaUploadModal: React.FC<MediaUploadModalProps> = ({
  visible,
  onClose,
  onMediaSelected,
  maxFiles = 10,
  allowedTypes = ['image', 'video'],
  title = 'Attach a Media File',
  description = 'Click below to attach a media file to the Post',
}) => {
  const [albums, setAlbums] = useState<string[]>([]);
  const [videoMedia, setVideoMedia] = useState<string[]>([]);
  const [imageLoading, setImageLoading] = useState(false);

  const renderVideoThumbnail = ({ item }: { item: string }) => (
    <View style={styles.videoContainer}>
      <Video
        source={{ uri: item }}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        shouldPlay={false}
        isMuted={true}
        usePoster
        posterSource={{ uri: item }}
        isLooping={false}
      />
    </View>
  );

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

  const videoAccess = async () => {
    try {
      setImageLoading(true);

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        quality: 1,
        allowsMultipleSelection: true,
      });

      if (!result.canceled) {
        const selectedVideos = result.assets;
        const validVideos = [];

        for (let video of selectedVideos) {
          const videoInfo = await FileSystem.getInfoAsync(video.uri);
          const fileSizeInMB = videoInfo.exists ? videoInfo.size / (1024 * 1024) : 0;

          if (fileSizeInMB <= 100) {
            validVideos.push(video.uri);
          }
        }

        if (validVideos.length > 2) {
          Alert.alert('Error', 'Please select at least 2 videos within 100 MB each.');
          setImageLoading(false);
          return;
        }

        setVideoMedia(validVideos);
      } else {
        Alert.alert('You did not select any videos.');
      }
    } catch (error) {
      Alert.alert('Error accessing media library', error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setImageLoading(false);
    }
  };

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
      } else {
        Alert.alert('You did not select any images.');
      }
    } catch (error) {
      Alert.alert('Error accessing media library', error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setImageLoading(false);
    }
  };

  const handleSubmitMedia = () => {
    const mediaFiles: MediaFile[] = [];

    // Process images
    albums.forEach((uri, index) => {
      const fileType = uri.substring(uri.lastIndexOf('.') + 1).toLowerCase();
      mediaFiles.push({
        uri,
        type: 'image',
        fileName: `image_${index}.${fileType}`,
      });
    });

    // Process videos
    videoMedia.forEach((uri, index) => {
      const fileType = uri.substring(uri.lastIndexOf('.') + 1).toLowerCase();
      mediaFiles.push({
        uri,
        type: 'video',
        fileName: `video_${index}.${fileType}`,
      });
    });

    onMediaSelected(mediaFiles);
    onClose();
  };

  const handleContinueWithoutMedia = () => {
    onMediaSelected([]);
    onClose();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <ScrollView
        contentContainerStyle={{
          width: '100%',
          height: '80%',
          flex: 1,
          backgroundColor: COLORS.lightGray2,
          marginTop: SIZES.padding * 6,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderWidth: 1.5,
          borderColor: COLORS.gray2,
          padding: 15,
        }}
      >
        <TouchableOpacity
          style={{ marginLeft: 'auto' }}
          onPress={onClose}
        >
          <Image
            source={icons.CancelPNG as any}
            resizeMode="contain"
            style={{ width: 15, height: 15 }}
          />
        </TouchableOpacity>

        <View>
          <Text style={{ fontSize: 25, fontWeight: '500', lineHeight: 30, color: COLORS.darkGray }}>
            {title}
          </Text>
          <Text style={{ fontSize: 15, fontWeight: '500', lineHeight: 30, color: COLORS.darkGray }}>
            {description}
          </Text>

          <TouchableOpacity
            style={{
              borderWidth: 1.5,
              padding: 10,
              borderColor: COLORS.gray,
              borderRadius: 20,
            }}
            disabled={imageLoading}
            onPress={mediaAccess}
          >
            {imageLoading ? (
              <CustomActivityIndicator size={SIZES.ACTIVITY_INDICATOR} color={`${COLORS.primary}`} />
            ) : (
              <Image
                source={icons.folderoutline as any}
                resizeMode="contain"
                style={{
                  width: 150,
                  height: 150,
                  tintColor: COLORS.darkGray,
                }}
              />
            )}
            <Text style={{ fontSize: 17, fontWeight: '500', lineHeight: 30, color: COLORS.darkGray, marginLeft: 15 }}>
              Click to Upload Picture
            </Text>
          </TouchableOpacity>

          <TextIconButton
            disabled={imageLoading}
            containerStyle={{
              height: 55,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: SIZES.radius,
              borderRadius: SIZES.radius,
              backgroundColor: '#0585FA',
              width: 200,
            }}
            icon={icons.playcircle}
            iconPosition="LEFT"
            iconStyle={{ tintColor: 'white', width: 19, height: 25 }}
            label="Select a Video"
            labelStyle={{ marginLeft: SIZES.radius, color: 'white' }}
            onPress={videoAccess}
          />

          <TextIconButton
            disabled={imageLoading}
            containerStyle={{
              height: 55,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: SIZES.radius,
              borderRadius: SIZES.radius,
              backgroundColor: '#0585FA',
              width: 200,
            }}
            icon={icons.audioRecord}
            iconPosition="LEFT"
            iconStyle={{ tintColor: 'white', width: 19, height: 25 }}
            label="Record Audio"
            labelStyle={{ marginLeft: SIZES.radius, color: 'white' }}
            onPress={() => {
              // Handle audio recording navigation
              // This would be passed as a prop or handled by parent
            }}
          />

          {albums.length > 0 && (
            <View style={{ marginTop: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8 }}>
                Selected Images:
              </Text>
              <FlatList
                data={albums}
                renderItem={renderImage}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </View>
          )}

          {videoMedia.length > 0 && (
            <View style={{ marginTop: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8 }}>
                Selected Videos:
              </Text>
              <FlatList
                data={videoMedia}
                renderItem={renderVideoThumbnail}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </View>
          )}
        </View>

        <TextButton
          label={albums.length || videoMedia.length ? 'Submit Media' : 'Continue without media'}
          buttonContainerStyle={{
            height: 55,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: SIZES.padding,
            borderRadius: SIZES.radius,
            backgroundColor: COLORS.primary,
          }}
          labelStyle={{
            color: COLORS.white,
            fontWeight: '700',
            fontSize: 17,
          }}
          onPress={() => {
            if (albums.length || videoMedia.length) {
              handleSubmitMedia();
            } else {
              handleContinueWithoutMedia();
            }
          }}
        />
      </ScrollView>
    </Modal>
  );
};

export default MediaUploadModal;

const styles = {
  videoContainer: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 10,
  },
  video: {
    width: 80,
    height: 80,
  },
};
