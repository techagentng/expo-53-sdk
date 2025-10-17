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
const REPORT_CATEGORIES = [
  { id: 1, name: 'Crime', icon: '🚔', color: '#FF6B6B' },
  { id: 2, name: 'Roads', icon: '🛣️', color: '#4ECDC4' },
  { id: 3, name: 'Health', icon: '🏥', color: '#45B7D1' },
  { id: 4, name: 'Education', icon: '📚', color: '#96CEB4' },
  { id: 5, name: 'Environment', icon: '🌳', color: '#FFEAA7' },
  { id: 6, name: 'Utilities', icon: '⚡', color: '#DDA0DD' },
  { id: 7, name: 'Transportation', icon: '🚇', color: '#98D8C8' },
  { id: 8, name: 'Housing', icon: '🏠', color: '#F7DC6F' },
  { id: 9, name: 'Public Safety', icon: '🛡️', color: '#BB8FCE' },
  { id: 10, name: 'Social Services', icon: '🤝', color: '#85C1E9' },
  { id: 11, name: 'Local Government', icon: '🏛️', color: '#F8C471' },
  { id: 12, name: 'Emergency', icon: '🚨', color: '#EC7063' },
  { id: 13, name: 'Infrastructure', icon: '🏗️', color: '#82E0AA' },
  { id: 14, name: 'Waste Management', icon: '🗑️', color: '#AED6F1' },
  { id: 15, name: 'Water Supply', icon: '💧', color: '#A3E4D7' },
  { id: 16, name: 'Electricity', icon: '⚡', color: '#F9E79F' },
  { id: 17, name: 'Telecommunications', icon: '📡', color: '#D7BDE2' },
  { id: 18, name: 'Public Transport', icon: '🚌', color: '#A8E6CF' },
  { id: 19, name: 'Street Lighting', icon: '💡', color: '#FADBD8' },
  { id: 20, name: 'Sanitation', icon: '🚽', color: '#ABEBC6' },
  { id: 21, name: 'Noise Pollution', icon: '🔊', color: '#F9CA24' },
  { id: 22, name: 'Others', icon: '📋', color: '#6C5CE7' },
];

export default function CreateTab() {
  const [selectedCategory, setSelectedCategory] = useState<typeof REPORT_CATEGORIES[0] | null>(null);
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

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('access_token');
      setToken(accessToken);
    } catch (e) {
      console.log('Error checking auth:', e);
    }
  };

  const handleCategorySelect = (category: typeof REPORT_CATEGORIES[0]) => {
    if (category.name === 'Others') {
      // Navigate to MakeReport screen for "Others"
      router.push('/screens/MakeReport' as any);
    } else {
      // Show specific report form for other categories
      setSelectedCategory(category);
      setShowReportForm(true);
    }
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

    setIsSubmittingReport(true);

    try {
      // Create FormData for the API call
      const formData = new FormData();
      formData.append('category', selectedCategory?.name || 'General');
      formData.append('sub_report_type', subReportType || selectedCategory?.name || 'General');
      formData.append('description', reportData.description.trim());
      formData.append('state_name', selectedState || '');
      formData.append('lga_name', selectedLocalGov || '');
      formData.append('is_anonymous', 'false');
      formData.append('date_of_incidence', new Date().toISOString());

      // Add special fields based on category
      const categoryName = selectedCategory?.name.toLowerCase();

      if (categoryName === 'roads') {
        formData.append('road_name', roadName.trim());
        formData.append('road_rating', rating.toString());
      }

      if (categoryName === 'electricity' || categoryName === 'power') {
        if (outageLength.trim()) {
          formData.append('outage_length', outageLength.trim());
        }
        formData.append('power_rating', rating.toString());
      }

      if (categoryName === 'crime') {
        if (crimeDate.trim()) {
          formData.append('incident_date', crimeDate.trim());
        }
        if (crimeTime.trim()) {
          formData.append('incident_time', crimeTime.trim());
        }
        formData.append('emergency_response', emergencyResponse?.toString() || 'null');
      }

      if (categoryName === 'health' || categoryName === 'healthcare') {
        formData.append('healthcare_rating', rating.toString());
      }

      if (categoryName === 'emergency' || categoryName === 'accidents') {
        if (causeOfAccident.trim()) {
          formData.append('cause_of_incident', causeOfAccident.trim());
        }
        formData.append('emergency_response', emergencyResponse?.toString() || 'null');
      }

      if (categoryName === 'others') {
        if (reportType.trim()) {
          formData.append('report_type', reportType.trim());
        }
      }

      if (reportData.location.trim()) {
        formData.append('landmark', reportData.location.trim());
      }

      // Dispatch the createReport action
      const result = await dispatch(createReport({ formData, token }));

      if (createReport.fulfilled.match(result)) {
        // Store report ID for media upload
        const reportResponse = result.payload as any;
        if (reportResponse && reportResponse.reportID) {
          setReportId(reportResponse.reportID);
        }

        // Success - show success modal and navigate to add media
        Alert.alert(
          'Report Submitted',
          'Your report has been successfully submitted!',
          [
            {
              text: 'Add Media',
              onPress: () => setShowMediaModal(true),
            },
            {
              text: 'Continue',
              style: 'cancel',
              onPress: () => router.replace('/(tabs)'),
            },
          ]
        );

        // Reset form
        setReportData({ description: '', location: '' });
        setSelectedState(null);
        setSelectedLocalGov(null);
        setSubReportType('');
        setRoadName('');
        setOutageLength('');
        setCauseOfAccident('');
        setReportType('');
        setEmergencyResponse(null);
        setCrimeDate('');
        setCrimeTime('');
        setRating(0);
        setShowReportForm(false);
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

  const renderCategoryItem = ({ item }: { item: typeof REPORT_CATEGORIES[0] }) => (
    <TouchableOpacity
      style={[styles.categoryItem, { backgroundColor: item.color }]}
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

        <ScrollView style={styles.formContainer}>
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
              placeholder={{ label: "Select type of incident", value: null }}
              onValueChange={(value) => setSubReportType(value || '')}
              items={selectedCategory ? INCIDENT_TYPES[selectedCategory.name.toLowerCase()] || [] : []}
              value={subReportType}
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
    <Modal visible={showMediaModal} animationType="fade" transparent>
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
              onPress={() => router.push('/screens/AudioRecord' as any)}
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
                  uploadMediaFile();
                } else {
                  setShowMediaModal(false);
                  router.replace('/(tabs)');
                }
              }}
              disabled={isUploadingMedia}
            >
              <Text style={styles.continueButtonText}>
                {isUploadingMedia
                  ? 'Uploading...'
                  : albums.length || videoMedia.length
                    ? 'Submit Media'
                    : 'Continue without media'
                }
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

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
          Alert.alert('Error', 'Please select at most 2 videos within 100 MB each.');
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

  const uploadMediaFile = async () => {
    if (!reportId || (!albums.length && !videoMedia.length)) {
      setShowMediaModal(false);
      router.replace('/(tabs)');
      return;
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

    const categoryName = selectedCategory.name.toLowerCase();

    switch (categoryName) {
      case 'roads':
        return (
          <View>
            <Text style={styles.label}>Road Name *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter road name"
              value={roadName}
              onChangeText={setRoadName}
            />

            <Text style={styles.label}>Road Rating</Text>
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

      case 'electricity':
      case 'power':
        return (
          <View>
            <Text style={styles.label}>Outage Duration (if applicable)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., 2 hours, 1 day"
              value={outageLength}
              onChangeText={setOutageLength}
            />

            <Text style={styles.label}>Power Supply Rating</Text>
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

      case 'crime':
        return (
          <View>
            <Text style={styles.label}>Incident Date</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Select date"
              value={crimeDate}
              onChangeText={setCrimeDate}
            />

            <Text style={styles.label}>Incident Time</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Select time"
              value={crimeTime}
              onChangeText={setCrimeTime}
            />

            <Text style={styles.label}>Emergency Response</Text>
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={styles.checkboxOption}
                onPress={() => setEmergencyResponse(true)}
              >
                <Text style={[styles.checkbox, emergencyResponse === true && styles.checkboxSelected]}>
                  ☐
                </Text>
                <Text style={styles.checkboxLabel}>Yes, there was response</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkboxOption}
                onPress={() => setEmergencyResponse(false)}
              >
                <Text style={[styles.checkbox, emergencyResponse === false && styles.checkboxSelected]}>
                  ☐
                </Text>
                <Text style={styles.checkboxLabel}>No response</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'health':
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

      case 'emergency':
      case 'accidents':
        return (
          <View>
            <Text style={styles.label}>Cause of Incident</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Describe what caused the incident"
              value={causeOfAccident}
              onChangeText={setCauseOfAccident}
            />

            <Text style={styles.label}>Emergency Response</Text>
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={styles.checkboxOption}
                onPress={() => setEmergencyResponse(true)}
              >
                <Text style={[styles.checkbox, emergencyResponse === true && styles.checkboxSelected]}>
                  ☐
                </Text>
                <Text style={styles.checkboxLabel}>Yes, there was response</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkboxOption}
                onPress={() => setEmergencyResponse(false)}
              >
                <Text style={[styles.checkbox, emergencyResponse === false && styles.checkboxSelected]}>
                  ☐
                </Text>
                <Text style={styles.checkboxLabel}>No response</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'others':
        return (
          <View>
            <Text style={styles.label}>What are you reporting about?</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              multiline
              numberOfLines={3}
              placeholder="Please describe what you're reporting about"
              value={reportType}
              onChangeText={setReportType}
            />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Report an Issue</Text>
      <Text style={styles.subtitle}>Select a category to report</Text>

      <FlatList
        data={REPORT_CATEGORIES}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      />

      {renderReportForm()}
      {renderMediaModal()}
    </View>
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
  grid: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryItem: {
    width: 100,
    height: 100,
    margin: 10,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
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
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
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
});
