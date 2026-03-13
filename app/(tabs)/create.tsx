import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Alert,
  Image,
  Linking,
} from 'react-native';
import * as Location from 'expo-location';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/Redux/store';
import { createReport } from '@/Redux/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SIZES } from '@/constants';
import { router } from 'expo-router';
import StateLocal from '../components/StateLocal';
import { NigeriaStates, LocalGovernment } from '../../data/state_local';
import RNPickerSelect from 'react-native-picker-select';
import { INCIDENT_TYPES } from '../../data/incidentTypes';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import { MEDIA_UPLOAD } from '@/Redux/URL';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AuthGuard } from '../../components/AuthGuard';
import { getCategories, getSubReports, transformCategoriesForFrontend, Category } from '../../services/categoryService';

// Dynamic categories will be loaded from API
const DEFAULT_CATEGORIES = [
  { id: 1, name: 'Crime', icon: '🚔', color: '#FF6B6B', backendName: 'crime' },
  { id: 2, name: 'Health', icon: '🏥', color: '#45B7D1', backendName: 'healthcare' },
  { id: 3, name: 'Education', icon: '📚', color: '#96CEB4', backendName: 'education' },
  { id: 4, name: 'Election', icon: '🗳️', color: '#DDA0DD', backendName: 'election' },
  { id: 5, name: 'Electricity', icon: '⚡', color: '#F9E79F', backendName: 'power' },
  { id: 6, name: 'Water Supply', icon: '💧', color: '#A3E4D7', backendName: 'portablewater' },
  { id: 7, name: 'Fake products', icon: '📦', color: '#FFEAA7', backendName: 'fakeproduct' },
];

export default function CreateTab() {
  const [selectedCategory, setSelectedCategory] = useState<typeof DEFAULT_CATEGORIES[0] | null>(null);
  const [reportCategories, setReportCategories] = useState(DEFAULT_CATEGORIES);
  const [subReports, setSubReports] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSubReports, setLoadingSubReports] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedLocalGov, setSelectedLocalGov] = useState<string | null>(null);
  const [reportData, setReportData] = useState({
    description: '',
    location: ''
  });
  const [subReportType, setSubReportType] = useState<string>('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  // Special fields for different categories
  const [roadName, setRoadName] = useState<string>('');
  const [outageLength, setOutageLength] = useState<string>('');
  const [showOutageDropdown, setShowOutageDropdown] = useState<boolean>(false);
  const [causeOfAccident, setCauseOfAccident] = useState<string>('');
  const [reportType, setReportType] = useState<string>('');
  const [emergencyResponse, setEmergencyResponse] = useState<boolean | null>(null);
  const [crimeDate, setCrimeDate] = useState<string>('');
  const [crimeTime, setCrimeTime] = useState<string>('');
  const [rating, setRating] = useState<number>(0);

  // Media upload state
  const [albums, setAlbums] = useState<string[]>([]);
  const [videoMedia, setVideoMedia] = useState<string[]>([]);
  const [reportId, setReportId] = useState<string | null>(null);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  // Date/Time picker state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [incidentDate, setIncidentDate] = useState<Date | null>(null);
  const [incidentTime, setIncidentTime] = useState<Date | null>(null);

  const getIncidentTypesKey = (name: string) => name.trim().toLowerCase().replace(/\s+/g, ' ');

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    checkAuth();
    loadCategories();
  }, []);

  // Load categories from API
  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const categories = await getCategories();
      const transformedCategories = transformCategoriesForFrontend(categories);
      setReportCategories(transformedCategories);
      console.log('Categories loaded:', transformedCategories);
    } catch (error) {
      console.error('Failed to load categories, using defaults:', error);
      // Keep using default categories if API fails
    } finally {
      setLoadingCategories(false);
    }
  };

  // Load sub-reports when category or state changes
  useEffect(() => {
    if (selectedCategory || selectedState) {
      loadSubReports();
    }
  }, [selectedCategory, selectedState]);

  const loadSubReports = async () => {
    try {
      setLoadingSubReports(true);
      const category = selectedCategory?.backendName || undefined;
      const stateName = selectedState || undefined;
      
      const subReportsData = await getSubReports(category, stateName);
      setSubReports(subReportsData);
      console.log('Sub-reports loaded:', subReportsData);
    } catch (error) {
      console.error('Failed to load sub-reports:', error);
      setSubReports([]);
    } finally {
      setLoadingSubReports(false);
    }
  };

  // Log when media modal visibility changes
  useEffect(() => {
    console.log('Media modal open:', showMediaModal);
  }, [showMediaModal]);

  const checkAuth = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('access_token');
      setToken(accessToken);
    } catch (e) {
      console.log('Error checking auth:', e);
    }
  };

  const handleCategorySelect = (category: typeof DEFAULT_CATEGORIES[0]) => {
    setSelectedCategory(category);
    setShowReportForm(true);
  };

  const getCurrentLocation = async () => {
    setIsGettingLocation(true);
    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to get your current location.',
          [{ text: 'OK' }]
        );
        setIsGettingLocation(false);
        return;
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // Reverse geocode to get address
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (address.length > 0) {
        const { street, city, region, country } = address[0];
        const locationString = [street, city, region, country]
          .filter(Boolean)
          .join(', ');

        setReportData(prev => ({
          ...prev,
          location: locationString || `${location.coords.latitude}, ${location.coords.longitude}`
        }));
      } else {
        // Fallback to coordinates if reverse geocoding fails
        setReportData(prev => ({
          ...prev,
          location: `${location.coords.latitude}, ${location.coords.longitude}`
        }));
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Unable to get your location. Please try again or enter manually.',
        [{ text: 'OK' }]
      );
      console.error('Location error:', error);
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleSubmitReport = async () => {
    if (!token) {
      Alert.alert(
        'Authentication Required',
        'Please login to create a report',
        [
          {
            text: 'Login',
            onPress: () => router.push('/screens/Login' as any),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
      return;
    }

    if (!reportData.description.trim()) {
      Alert.alert('Error', 'Please provide a description for your report.');
      return;
    }

    if (!selectedCategory) {
      Alert.alert('Error', 'Please select a report category.');
      return;
    }

    setIsSubmittingReport(true);

    try {
      // Create FormData for the API call
      const formData = new FormData();
      formData.append('category', selectedCategory.name);
      formData.append('sub_report_type', subReportType || selectedCategory.name);
      formData.append('description', reportData.description.trim());
      formData.append('state_name', selectedState || '');
      formData.append('lga_name', selectedLocalGov || '');
      formData.append('is_anonymous', 'false');
      formData.append('date_of_incidence', new Date().toISOString());

      // Add special fields based on category
      const categoryName = selectedCategory.name.toLowerCase();

      if (categoryName === 'roads') {
        if (roadName.trim()) {
          formData.append('road_name', roadName.trim());
        }
        if (rating > 0) {
          formData.append('road_rating', rating.toString());
        }
      }

      if (categoryName === 'electricity' || categoryName === 'power') {
        if (outageLength.trim()) {
          formData.append('outage_length', outageLength.trim());
        }
        if (rating > 0) {
          formData.append('power_rating', rating.toString());
        }
      }

      if (categoryName === 'crime') {
        if (incidentDate) {
          formData.append('incident_date', incidentDate.toISOString().split('T')[0]);
        }
        if (incidentTime) {
          formData.append('incident_time', incidentTime.toTimeString().split(' ')[0]);
        }
        if (emergencyResponse !== null) {
          formData.append('emergency_response', emergencyResponse.toString());
        }
      }

      if (categoryName === 'health' || categoryName === 'healthcare') {
        if (rating > 0) {
          formData.append('healthcare_rating', rating.toString());
        }
      }

      if (categoryName === 'emergency' || categoryName === 'accidents') {
        if (causeOfAccident.trim()) {
          formData.append('cause_of_incident', causeOfAccident.trim());
        }
        if (emergencyResponse !== null) {
          formData.append('emergency_response', emergencyResponse.toString());
        }
      }

      if (reportData.location.trim()) {
        formData.append('landmark', reportData.location.trim());
      }

      console.log('FormData contents:');
      // FormData doesn't have entries() in React Native, so we'll log key fields
      console.log('description:', reportData.description.trim());
      console.log('category:', selectedCategory.name);
      console.log('sub_report_type:', subReportType || selectedCategory.name);
      console.log('state_name:', selectedState || '');
      console.log('lga_name:', selectedLocalGov || '');

      // Dispatch the createReport action
      const result = await dispatch(createReport({ formData, token }));
      console.log('createReport result:', {
        type: (result as any)?.type,
        status: (result as any)?.meta?.requestStatus,
        payloadKeys: result && typeof result === 'object' ? Object.keys((result as any).payload || {}) : [],
      });

      if (createReport.fulfilled.match(result)) {
        // Store report ID for media upload
        const payload: any = result.payload;
        const possibleId = payload?.reportID
          || payload?.id
          || payload?.data?.reportID
          || payload?.data?.id
          || payload?.report_id
          || payload?.data?.report_id
          || null;
        if (possibleId) setReportId(String(possibleId));
        
        // Reset form first
        setReportData({ description: '', location: '' });
        setSelectedState(null);
        setSelectedLocalGov(null);
        setSubReportType('');
        setRoadName('');
        setOutageLength('');
        setCauseOfAccident('');
        setEmergencyResponse(null);
        setIncidentDate(null);
        setIncidentTime(null);
        setRating(0);
        setShowReportForm(false);
        
        // Open media modal once
        console.log('Opening media modal now (post-report)');
        setShowMediaModal(true);
      } else if (createReport.rejected.match(result)) {
        // Handle error
        const errorPayload = result.payload as any;
        Alert.alert(
          'Submission Failed',
          errorPayload?.message || 'Failed to submit report. Please try again.'
        );
      }
    } catch (error) {
      console.error('Report submission error:', error);
      Alert.alert(
        'Error',
        'An unexpected error occurred. Please try again.'
      );
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const renderCategoryItem = ({ item }: { item: typeof reportCategories[0] }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => handleCategorySelect(item)}
    >
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderReportForm = () => (
    <Modal visible={showReportForm} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowReportForm(false)}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Report {selectedCategory?.name}</Text>
        </View>

        <ScrollView style={styles.formContainer} contentContainerStyle={styles.formContent}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            multiline
            numberOfLines={6}
            placeholder="Describe the issue in detail..."
            value={reportData.description}
            onChangeText={(text) => setReportData({ ...reportData, description: text })}
          />

          <Text style={styles.label}>Sub Report Type</Text>
          <View style={styles.pickerContainer}>
            <RNPickerSelect
              placeholder={{ 
                label: loadingSubReports ? "Loading sub-reports..." : "Select type of incident", 
                value: null 
              }}
              onValueChange={(value) => setSubReportType(value || '')}
              items={subReports.map(subReport => ({
                label: subReport.sub_report_type,
                value: subReport.sub_report_type,
                key: subReport.id
              }))}
              value={subReportType}
              disabled={loadingSubReports}
              style={{
                inputIOS: styles.pickerInput,
                inputAndroid: styles.pickerInput,
                placeholder: styles.pickerPlaceholder,
              }}
            />
          </View>

          <Text style={styles.label}>Location</Text>
          <TouchableOpacity
            style={styles.locationButton}
            onPress={getCurrentLocation}
            disabled={isGettingLocation}
          >
            <Text style={styles.locationButtonText}>
              {isGettingLocation ? 'Getting Location...' : '📍 Get Current Location'}
            </Text>
          </TouchableOpacity>
          {reportData.location ? (
            <Text style={styles.locationDisplay}>{reportData.location}</Text>
          ) : null}

          <StateLocal
            selectedState={selectedState}
            setSelectedState={setSelectedState}
            selectedLocalGov={selectedLocalGov}
            setSelectedLocalGov={setSelectedLocalGov}
          />

          {renderSpecialFields()}

          <TouchableOpacity
            style={[styles.submitButton, isSubmittingReport && styles.submitButtonDisabled]}
            onPress={handleSubmitReport}
            disabled={isSubmittingReport}
          >
            <Text style={styles.submitButtonText}>
              {isSubmittingReport ? 'Submitting...' : 'Submit Report'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );

  const renderMediaModal = () => (
    <Modal
      visible={showMediaModal}
      animationType="fade"
      transparent
      statusBarTranslucent
      presentationStyle="overFullScreen"
      onRequestClose={() => console.log('Media modal onRequestClose')}
    >
      <View style={styles.mediaModalOverlay}>
        <View style={styles.mediaModal}>
          <View style={styles.mediaModalHeader}>
            <Text style={styles.mediaModalTitle}>Add Media to Report</Text>
            <TouchableOpacity onPress={() => setShowMediaModal(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.mediaOptions}>
            <TouchableOpacity style={styles.mediaOption} onPress={mediaAccess} disabled={imageLoading}>
              <Text style={styles.mediaIcon}>📷</Text>
              <Text style={styles.mediaText}>Upload Picture</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.mediaOption} onPress={videoAccess} disabled={imageLoading}>
              <Text style={styles.mediaIcon}>🎥</Text>
              <Text style={styles.mediaText}>Select Video</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.mediaOption}
              onPress={() => router.push('/screens/AudioRecordScreen' as any)}
            >
              <Text style={styles.mediaIcon}>🎙️</Text>
              <Text style={styles.mediaText}>Record Audio</Text>
            </TouchableOpacity>
          </View>

          {/* Preview Selected Images */}
          {albums.length > 0 && (
            <View style={{ marginTop: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8 }}>
                Selected Images:
              </Text>
              <FlatList
                data={albums}
                renderItem={({ item }) => (
                  <Image
                    source={{ uri: item }}
                    style={{
                      width: 80,
                      height: 80,
                      marginRight: 10,
                      borderRadius: SIZES.radius,
                    }}
                  />
                )}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </View>
          )}

          {/* Preview Selected Videos */}
          {videoMedia.length > 0 && (
            <View style={{ marginTop: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8 }}>
                Selected Videos:
              </Text>
              <FlatList
                data={videoMedia}
                renderItem={({ item }) => (
                  <View style={{
                    width: 80,
                    height: 80,
                    marginRight: 10,
                    borderRadius: 10,
                    backgroundColor: COLORS.lightGray2,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <Text style={{ fontSize: 24 }}>🎥</Text>
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </View>
          )}

          <View style={styles.mediaModalFooter}>
            <TouchableOpacity
              style={[
                styles.continueButton,
                (isUploadingMedia || (!albums.length && !videoMedia.length)) && { opacity: 0.5 }
              ]}
              onPress={() => {
                if (albums.length || videoMedia.length) {
                  console.log('Upload starting', { reportId, images: albums.length, videos: videoMedia.length });
                  uploadMediaFile();
                } else {
                  // No media selected yet: prompt picker again instead of closing the modal
                  mediaAccess().catch(() => {});
                }
              }}
              disabled={isUploadingMedia}
            >
              <Text style={styles.continueButtonText}>
                {isUploadingMedia
                  ? 'Uploading...'
                  : albums.length || videoMedia.length
                    ? 'Submit Media'
                    : 'Select Media'
                }
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.continueButton, { backgroundColor: COLORS.lightGray1 }]}
              onPress={() => {
                console.log('User chose to skip media');
                setShowMediaModal(false);
                router.replace('/(tabs)');
              }}
            >
              <Text style={[styles.continueButtonText, { color: COLORS.darkGray }]}>Skip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const mediaAccess = async () => {
    try {
      setImageLoading(true);
      // Request library permission first
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        setImageLoading(false);
        Alert.alert(
          'Permission required',
          'Photo library access is needed to select media. You can enable it in Settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
        return;
      }
      let result = await ImagePicker.launchImageLibraryAsync({
        quality: 1,
        allowsMultipleSelection: true,
      });

      console.log('Picker result (images):', result);
      if (!result.canceled) {
        const selectedImages = result.assets.map((asset) => asset.uri);
        setAlbums(selectedImages);
      } else {
        // keep modal open and allow retry
        console.log('No images selected');
      }
    } catch (error) {
      Alert.alert('Error accessing media library', error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setImageLoading(false);
    }
  };

  const videoAccess = async () => {
    try {
      setImageLoading(true);
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        setImageLoading(false);
        Alert.alert(
          'Permission required',
          'Photo library access is needed to select videos. You can enable it in Settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
        return;
      }
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        quality: 1,
        allowsMultipleSelection: true,
      });

      console.log('Picker result (videos):', result);
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
          Alert.alert('Error', 'Please select at most 2 videos within 100 MB each.');
          setImageLoading(false);
          return;
        }

        setVideoMedia(validVideos);
      } else {
        // keep modal open and allow retry
        console.log('No videos selected');
      }
    } catch (error) {
      Alert.alert('Error accessing media library', error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setImageLoading(false);
    }
  };

  const uploadMediaFile = async () => {
    if (!reportId) {
      if (albums.length || videoMedia.length) {
        Alert.alert('Unable to upload', 'We could not find the report ID. Please submit the report again and then add media.');
        return;
      } else {
        setShowMediaModal(false);
        router.replace('/(tabs)');
        return;
      }
    }

    try {
      setIsUploadingMedia(true);

      const mediaFormData = new FormData();
      mediaFormData.append('report_id', reportId);

      // Process videos
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

      // Process images
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

      const mediaResponse = await axios.post(MEDIA_UPLOAD, mediaFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        transformRequest: (data, headers) => data,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          console.log('Upload progress:', percentCompleted);
        },
      });

      // Success - navigate to main screen
      setAlbums([]);
      setVideoMedia([]);
      setReportId(null);
      setShowMediaModal(false);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Media upload error:', error);
      handleMediaUploadError(error);
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleMediaUploadError = (error: any) => {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.log('Media upload server error:', error.response.data);
        if (error.response.status === 401) {
          Alert.alert(
            'Session Expired',
            'Your session has expired. Please login again.',
            [
              {
                text: 'Login',
                onPress: () => router.push('/screens/Login' as any),
              },
            ]
          );
          return;
        } else if (error.response.status === 500) {
          Alert.alert('Error', 'Server error. Please try again later or contact support.');
        } else {
          Alert.alert('Upload Failed', error.response.data.message || 'There was an issue uploading media. Please try again later.');
        }
      } else if (error.request) {
        console.log('Media upload network error:', error.message);
        Alert.alert('Upload Failed', 'Network error. Please check your internet connection and try again.');
      } else {
        console.log('Media upload error:', error.message);
        Alert.alert('Upload Failed', 'An unexpected error occurred. Please try again.');
      }
    } else {
      console.log('Non-axios media upload error:', error);
      Alert.alert('Upload Failed', 'An unexpected error occurred. Please try again.');
    }
  };

  const renderSpecialFields = () => {
    if (!selectedCategory) return null;

    // Use backend category name for API calls
    const backendCategoryName = selectedCategory.backendName;

    switch (backendCategoryName) {
      case 'roads':
        return (
          <View>
            <View style={styles.twoColumnRow}>
              <TextInput
                style={[styles.textInput, styles.twoColumnLeft]}
                placeholder="Road name"
                value={roadName}
                onChangeText={setRoadName}
              />

              <View style={[styles.ratingContainer, styles.twoColumnRight, { marginBottom: 0, justifyContent: 'flex-end' }]}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setRating(star)}
                    style={styles.starButton}
                  >
                    <Text style={[styles.star, rating >= star && styles.starSelected]}>
                      ★
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );

      case 'power':
        return (
          <View>
            <Text style={styles.label}>Outage Duration</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowOutageDropdown(true)}
            >
              <Text style={styles.dropdownText}>
                {outageLength || 'Select outage duration'}
              </Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>
            
            <Modal
              visible={showOutageDropdown}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setShowOutageDropdown(false)}
            >
              <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setShowOutageDropdown(false)}
              >
                <View style={styles.dropdownModal}>
                  <Text style={styles.dropdownTitle}>Select Outage Duration</Text>
                  {[
                    'Less than 1 hour',
                    '1-3 hours',
                    '3-6 hours',
                    '6-12 hours',
                    '12-24 hours',
                    '1-2 days',
                    '3-5 days',
                    '1 week',
                    '2 weeks',
                    '3+ weeks'
                  ].map((duration) => (
                    <TouchableOpacity
                      key={duration}
                      style={styles.dropdownOption}
                      onPress={() => {
                        setOutageLength(duration);
                        setShowOutageDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownOptionText}>{duration}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableOpacity>
            </Modal>
          </View>
        );

      case 'crime':
        return (
          <View>
            <View style={styles.twoColumnRow}>
              <TouchableOpacity
                style={[styles.dateTimeButton, styles.twoColumnLeft]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateTimeButtonText}>
                  {incidentDate ? incidentDate.toLocaleDateString() : 'Date'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.dateTimeButton, styles.twoColumnRight]}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={styles.dateTimeButtonText}>
                  {incidentTime ? incidentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Time'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.checkboxContainer, styles.responseRow]}>
              <Text style={styles.responseLabel}>Response:</Text>
              <TouchableOpacity
                style={styles.checkboxOption}
                onPress={() => setEmergencyResponse(true)}
              >
                <Text style={[styles.checkbox, emergencyResponse === true && styles.checkboxSelected]}>
                  {emergencyResponse === true ? '☑' : '☐'}
                </Text>
                <Text style={styles.checkboxLabel}>Yes</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkboxOption}
                onPress={() => setEmergencyResponse(false)}
              >
                <Text style={[styles.checkbox, emergencyResponse === false && styles.checkboxSelected]}>
                  {emergencyResponse === false ? '☑' : '☐'}
                </Text>
                <Text style={styles.checkboxLabel}>No</Text>
              </TouchableOpacity>
            </View>

            {/* Date Picker */}
            {showDatePicker && (
              <DateTimePicker
                value={incidentDate || new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setIncidentDate(selectedDate);
                  }
                }}
              />
            )}

            {/* Time Picker */}
            {showTimePicker && (
              <DateTimePicker
                value={incidentTime || new Date()}
                mode="time"
                display="default"
                onChange={(event, selectedTime) => {
                  setShowTimePicker(false);
                  if (selectedTime) {
                    setIncidentTime(selectedTime);
                  }
                }}
              />
            )}
          </View>
        );

      case 'healthcare':
        return (
          <View>
            <Text style={styles.label}>Healthcare Experience Rating</Text>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  style={styles.starButton}
                >
                  <Text style={[styles.star, rating >= star && styles.starSelected]}>
                    ★
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 'education':
        return (
          <View>
            <Text style={styles.label}>School Name (Optional)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter school name"
              value={causeOfAccident} // Reusing existing state for simplicity
              onChangeText={setCauseOfAccident}
            />
          </View>
        );

      case 'election':
        return (
          <View>
            <Text style={styles.label}>Polling Station Details</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              multiline
              numberOfLines={3}
              placeholder="Describe the election issue and polling station details..."
              value={causeOfAccident} // Reusing existing state
              onChangeText={setCauseOfAccident}
            />
          </View>
        );

      case 'portablewater':
        return (
          <View>
            <Text style={styles.label}>Water Supply Issue Type</Text>
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={styles.checkboxOption}
                onPress={() => setEmergencyResponse(true)}
              >
                <Text style={[styles.checkbox, emergencyResponse === true && styles.checkboxSelected]}>
                  {emergencyResponse === true ? '☑' : '☐'}
                </Text>
                <Text style={styles.checkboxLabel}>No Water Supply</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkboxOption}
                onPress={() => setEmergencyResponse(false)}
              >
                <Text style={[styles.checkbox, emergencyResponse === false && styles.checkboxSelected]}>
                  {emergencyResponse === false ? '☑' : '☐'}
                </Text>
                <Text style={styles.checkboxLabel}>Contaminated Water</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'fakeproduct':
        return (
          <View>
            <Text style={styles.label}>Product Details</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Brand name and product type"
              value={causeOfAccident} // Reusing existing state
              onChangeText={setCauseOfAccident}
            />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <AuthGuard>
      <View style={styles.container}>
        <Text style={styles.title}>Report an Issue</Text>
        <Text style={styles.subtitle}>Select a category to report</Text>

        {loadingCategories ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading categories...</Text>
          </View>
        ) : (
          <FlatList
            data={reportCategories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            columnWrapperStyle={styles.gridRow}
            contentContainerStyle={styles.grid}
            showsVerticalScrollIndicator={false}
          />
        )}

        {renderReportForm()}
        {renderMediaModal()}
      </View>
    </AuthGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray2,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.darkGray,
    textAlign: 'center',
    marginBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.primary,
    textAlign: 'center',
  },
  grid: {
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  gridRow: {
    justifyContent: 'center',
  },
  categoryItem: {
    width: '30%',
    margin: 8,
    paddingVertical: 4,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray1,
  },
  backButton: {
    fontSize: 16,
    color: COLORS.primary,
    marginRight: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  formContent: {
    paddingBottom: 40,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 8,
    marginTop: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.lightGray1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.lightGray1,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  pickerInput: {
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: COLORS.darkGray,
  },
  pickerPlaceholder: {
    fontSize: 16,
    color: COLORS.gray,
  },
  dateTimeButton: {
    borderWidth: 1,
    borderColor: COLORS.lightGray1,
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 16,
    alignItems: 'center',
  },
  dateTimeButtonText: {
    fontSize: 16,
    color: COLORS.darkGray,
  },
  locationButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  locationButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  locationDisplay: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: 8,
    padding: 8,
    backgroundColor: COLORS.lightGray2,
    borderRadius: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  twoColumnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  twoColumnLeft: {
    flex: 1,
    marginRight: 8,
  },
  twoColumnRight: {
    flex: 1,
    marginLeft: 8,
  },
  starButton: {
    padding: 4,
  },
  star: {
    fontSize: 24,
    color: COLORS.lightGray1,
  },
  starSelected: {
    color: '#FFD700',
  },
  checkboxContainer: {
    marginBottom: 16,
  },
  responseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  responseLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginRight: 10,
  },
  checkbox: {
    fontSize: 20,
    marginRight: 12,
    color: COLORS.lightGray1,
  },
  checkboxSelected: {
    color: COLORS.primary,
  },
  checkboxLabel: {
    fontSize: 16,
    color: COLORS.darkGray,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.lightGray1,
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  mediaModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaModal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  mediaModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  mediaModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  closeButton: {
    fontSize: 24,
    color: COLORS.darkGray,
  },
  mediaOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  mediaOption: {
    alignItems: 'center',
    padding: 16,
  },
  mediaIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  mediaText: {
    fontSize: 12,
    color: COLORS.primary,
    textAlign: 'center',
  },
  mediaModalFooter: {
    alignItems: 'center',
  },
  continueButton: {
    backgroundColor: COLORS.lightGray1,
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  continueButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLORS.lightGray1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  dropdownText: {
    fontSize: 16,
    color: COLORS.darkGray,
  },
  dropdownArrow: {
    fontSize: 12,
    color: COLORS.lightGray1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownModal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  dropdownTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  dropdownOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray1,
  },
  dropdownOptionText: {
    fontSize: 16,
    color: COLORS.darkGray,
  },
});
