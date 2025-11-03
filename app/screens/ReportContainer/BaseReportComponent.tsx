import React, { useEffect, useState } from 'react';
import {
  View,
  Alert,
  Modal,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  Text,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/Redux/store';
import { createReport } from '@/Redux/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Video, ResizeMode } from 'expo-av';
import axios from 'axios';
import { router } from 'expo-router';

import ReportWrapper from './ReportWrapper';
import StateLocal from '../../components/StateLocal';
import UserLocation from '../../components/UserLocation';
import AnonymousPost from '../../components/AnonymousPost';
import TextButton from '../../components/TextButton';
import TextIconButton from '../../components/TextIconButton';
import TextDesc from '../../components/TextDesc';
import FormInput from '../../components/FormInput';
import CustomActivityIndicator from '../../components/CustomActivityIndicator';
import LoadingImage from '../../components/loadingStates/LoadingImage';
import ErrorImage from '../../components/loadingStates/ErrorImage';
import NetworkError from '../../components/loadingStates/NetworkError';

import { COLORS, icons, SIZES } from '@/constants';
import { CREATE_REPORT, MEDIA_UPLOAD } from '@/Redux/URL';

export interface ReportCategory {
  id: string;
  name: string;
  title: string;
  fields: ReportField[];
  validation?: (data: ReportData) => boolean;
}

export interface ReportField {
  name: keyof ReportData;
  label: string;
  type: 'text' | 'select' | 'date' | 'location' | 'checkbox' | 'textarea' | 'custom';
  required?: boolean;
  options?: string[];
  placeholder?: string;
  component?: string;
}

export interface ReportData {
  category: string;
  sub_report_type: string;
  description: string;
  state_name: string;
  lga_name: string;
  is_anonymous: boolean;
  date_of_incidence: string;
  landmark?: string;
  latitude?: number;
  longitude?: number;
  product_name?: string;
  outage_length?: string;
}

interface BaseReportProps {
  category: ReportCategory;
  navigation: any;
  children?: React.ReactNode;
}

const BaseReportComponent: React.FC<BaseReportProps> = ({
  category,
  navigation,
  children,
}) => {
  // State management
  const [formData, setFormData] = useState<Partial<ReportData>>({
    category: category.name,
    is_anonymous: false,
    date_of_incidence: new Date().toISOString(),
  });

  const [albums, setAlbums] = useState<string[]>([]);
  const [videoMedia, setVideoMedia] = useState<string[]>([]);
  const [storedRecording, setStoredRecording] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [token, setToken] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const value = await AsyncStorage.getItem('access_token');
      if (!value) {
        Alert.alert(
          'Authentication Required',
          'Please login to create a report',
          [
            {
              text: 'Login',
              onPress: () => navigation.navigate('Login'),
            },
            {
              text: 'Cancel',
              onPress: () => navigation.goBack(),
              style: 'cancel',
            },
          ]
        );
        return;
      }
      setToken(value);
    } catch (e) {
      console.log(e);
      Alert.alert('Error', 'Failed to check authentication status');
    }
  };

  const updateFormData = (field: keyof ReportData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

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

  const validateForm = (): boolean => {
    if (category.validation) {
      return category.validation(formData as ReportData);
    }

    // Default validation
    return !!(
      formData.sub_report_type &&
      formData.description &&
      formData.state_name &&
      !loading
    );
  };

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

  const uploadMediaFile = async (reportId: string) => {
    try {
      setLoading(true);

      const mediaFormData = new FormData();
      mediaFormData.append('report_id', reportId);

      if (videoMedia.length > 0) {
        videoMedia.forEach((videoUri, index) => {
          const fileType = videoUri.substring(videoUri.lastIndexOf('.') + 1).toLowerCase();
          const allowedVideoTypes = ['mp4', 'mov', 'avi', 'mkv', 'webm'];
          if (allowedVideoTypes.includes(fileType)) {
            mediaFormData.append('mediaFiles', {
              uri: videoUri,
              type: `video/${fileType}`,
              name: `video_${index}.${fileType}`,
            } as any);
          }
        });
      }

      if (albums.length > 0) {
        albums.forEach((album, index) => {
          const fileType = album.substring(album.lastIndexOf('.') + 1).toLowerCase();
          let mediaType = ['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(fileType) ? 'video' : 'image';

          mediaFormData.append('mediaFiles', {
            uri: album,
            type: `${mediaType}/${fileType}`,
            name: `media_${index}.${fileType}`,
          } as any);
        });
      }

      if (storedRecording) {
        const audioFileType = storedRecording.substring(storedRecording.lastIndexOf('.') + 1);
        mediaFormData.append('mediaFiles', {
          uri: storedRecording,
          type: `audio/${audioFileType}`,
          name: `recording.${audioFileType}`,
        } as any);
      }

      const mediaResponse = await axios.post(MEDIA_UPLOAD, mediaFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        transformRequest: (data, headers) => data,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          console.log(percentCompleted);
        },
      });

      setAlbums([]);
      console.log(mediaResponse.data);
      router.replace('/(tabs)');
    } catch (error) {
      setError(error);
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (error: any) => {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.log('server error:', error.response.data);
        if (error.response.status === 401) {
          Alert.alert(
            'Session Expired',
            'Your session has expired. Please login again.',
            [
              {
                text: 'Login',
                onPress: () => navigation.navigate('Login'),
              },
            ]
          );
          return;
        } else if (error.response.status === 500) {
          setErrorMessage('Server error. Please try again later or contact support.');
        } else {
          setErrorMessage(error.response.data.message || 'There was an issue with the server. Please try again later.');
        }
      } else if (error.request) {
        console.log('network error:', error.message);
        setErrorMessage('Network error. Please check your internet connection and try again.');
      } else {
        console.log('error:', error.message);
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    } else {
      console.log('Non-axios error:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    }
  };

  const submitReport = async () => {
    if (!token) {
      Alert.alert(
        'Authentication Required',
        'Please login to create a report',
        [
          {
            text: 'Login',
            onPress: () => navigation.navigate('Login'),
          },
          {
            text: 'Cancel',
            onPress: () => navigation.goBack(),
            style: 'cancel',
          },
        ]
      );
      return;
    }

    try {
      setLoading(true);

      const submitData = new FormData();
      submitData.append('category', formData.category || category.name);
      submitData.append('sub_report_type', formData.sub_report_type || '');
      submitData.append('description', formData.description || '');
      submitData.append('state_name', formData.state_name || '');
      submitData.append('lga_name', formData.lga_name || '');
      submitData.append('is_anonymous', (formData.is_anonymous || false).toString());
      submitData.append('date_of_incidence', formData.date_of_incidence || new Date().toISOString());

      if (formData.landmark) {
        submitData.append('landmark', formData.landmark);
      }

      // Dispatch createReport thunk
      const result = await dispatch(createReport({ formData: submitData, token }));

      if (createReport.fulfilled.match(result)) {
        setModalOpen(true);
        // Store report ID for media upload
        // result.payload.id
      } else if (createReport.rejected.match(result)) {
        const errorPayload = result.payload as any;
        setErrorMessage(errorPayload?.message || 'Failed to create report. Please try again.');
        return;
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error);
      handleError(error);
    }
  };

  // Render form field based on type
  const renderField = (field: ReportField) => {
    switch (field.type) {
      case 'text':
        return (
          <FormInput
            key={field.name}
            label={field.label}
            onChangeText={(value: string) => updateFormData(field.name, value)}
            autoCapitalize="words"
            value={formData[field.name] as string || ''}
            placeholder={field.placeholder}
            formInputStyle={{
              borderWidth: 1,
              borderColor: COLORS.gray2,
              borderRadius: 7,
            }}
          />
        );

      case 'textarea':
        return (
          <TextDesc
            key={field.name}
            onChange={(value: string) => updateFormData(field.name, value)}
            value={formData[field.name] as string || ''}
            placeholder={field.placeholder}
          />
        );

      case 'select':
        return (
          <FormInput
            key={field.name}
            label={field.label}
            onChangeText={(value: string) => updateFormData(field.name, value)}
            autoCapitalize="words"
            value={formData[field.name] as string || ''}
            placeholder={field.placeholder}
            formInputStyle={{
              borderWidth: 1,
              borderColor: COLORS.gray2,
              borderRadius: 7,
            }}
          />
        );

      case 'custom':
        if (field.component === 'StateLocal') {
          return (
            <StateLocal
              key={field.name}
              selectedState={formData.state_name || null}
              setSelectedState={(value: string | null) => updateFormData('state_name', value)}
              selectedLocalGov={formData.lga_name || null}
              setSelectedLocalGov={(value: string | null) => updateFormData('lga_name', value)}
            />
          );
        }
        if (field.component === 'UserLocation') {
          return (
            <UserLocation
              key={field.name}
              location={formData.latitude && formData.longitude ? {
                latitude: formData.latitude,
                longitude: formData.longitude
              } : null}
              setLocation={(location: any) => {
                if (location) {
                  updateFormData('latitude', location.latitude);
                  updateFormData('longitude', location.longitude);
                }
              }}
            />
          );
        }
        return null;

      case 'checkbox':
        if (field.name === 'is_anonymous') {
          return (
            <AnonymousPost
              key={field.name}
              isEnabled={formData.is_anonymous || false}
              setIsEnabled={(value: boolean) => updateFormData('is_anonymous', value)}
            />
          );
        }
        return null;

      default:
        return null;
    }
  };

  // Error state rendering
  if (error && typeof error === 'object' && 'response' in error) {
    return (
      <View style={styles.errorStyle}>
        <ErrorImage />
        <Text style={styles.errorText}>{errorMessage}</Text>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <TextButton
            label="Go Back"
            buttonContainerStyle={styles.backButton}
            labelStyle={styles.backButtonText}
            onPress={() => navigation.goBack()}
          />
        </View>
      </View>
    );
  } else if (error && typeof error === 'object' && 'request' in error) {
    return (
      <View style={styles.errorStyle}>
        <NetworkError />
        <Text style={styles.errorText}>{errorMessage}</Text>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <TextButton
            label="Go Back"
            buttonContainerStyle={styles.backButton}
            labelStyle={styles.backButtonText}
            onPress={() => navigation.goBack()}
          />
        </View>
      </View>
    );
  }

  if (loading) return <LoadingImage />;

  return (
    <ReportWrapper title={category.title}>
      {children}

      {/* Render form fields */}
      {category.fields.map(renderField)}

      <TextButton
        label="Submit Report"
        disabled={!validateForm()}
        buttonContainerStyle={{
          height: 55,
          alignItems: 'center',
          justifyContent: 'center',
          marginVertical: SIZES.padding,
          borderRadius: SIZES.radius,
          backgroundColor: validateForm() ? '#0E9C67' : COLORS.gray3,
        }}
        labelStyle={{
          color: COLORS.white,
          fontWeight: '700',
          fontSize: 17,
        }}
        onPress={submitReport}
      />

      {/* Media Upload Modal */}
      <Modal animationType="slide" transparent={true} visible={modalOpen}>
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
            onPress={() => {
              setModalOpen(false);
              router.replace('/(tabs)');
            }}
          >
            <Image
              source={icons.CancelPNG as any}
              resizeMode="contain"
              style={{ width: 15, height: 15 }}
            />
          </TouchableOpacity>

          <View>
            <Text style={{ fontSize: 25, fontWeight: '500', lineHeight: 30, color: COLORS.darkGray }}>
              Attach a Media File
            </Text>
            <Text style={{ fontSize: 15, fontWeight: '500', lineHeight: 30, color: COLORS.darkGray }}>
              Click below to attach a media file to the Post
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
              onPress={() => navigation.navigate('AudioRecordScreen', { setStoredRecording })}
            />

            {albums.length > 0 && (
              <View style={{ marginTop: 8 }}>
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
              <View style={styles.galleryContainer}>
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
                // uploadMediaFile(reportId);
              } else {
                setModalOpen(false);
                router.replace('/(tabs)');
              }
            }}
          />
        </ScrollView>
      </Modal>
    </ReportWrapper>
  );
};

export default BaseReportComponent;

const styles = {
  errorStyle: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingHorizontal: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    fontWeight: '400' as const,
    textAlign: 'center' as const,
    marginTop: 16,
    marginBottom: 20,
  },
  backButton: {
    height: 50,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginTop: 10,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.gray3,
    width: '80%' as const,
  },
  backButtonText: {
    color: COLORS.white,
    fontWeight: '700' as const,
    fontSize: 16,
  },
  galleryContainer: {
    marginTop: 5,
  },
  videoContainer: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 10,
    overflow: 'hidden' as const,
  },
  video: {
    width: '100%' as const,
    height: '100%' as const,
  },
};
