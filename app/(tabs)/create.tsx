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
import { COLORS } from '@/constants';
import { router } from 'expo-router';
import StateLocal from '../components/StateLocal';
import { NigeriaStates, LocalGovernment } from '../../data/state_local';
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
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

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
      formData.append('sub_report_type', selectedCategory?.name || 'General');
      formData.append('description', reportData.description.trim());
      formData.append('state_name', selectedState || '');
      formData.append('lga_name', selectedLocalGov || '');
      formData.append('is_anonymous', 'false');
      formData.append('date_of_incidence', new Date().toISOString());

      if (reportData.location.trim()) {
        formData.append('landmark', reportData.location.trim());
      }

      // Dispatch the createReport action
      const result = await dispatch(createReport({ formData, token }));

      if (createReport.fulfilled.match(result)) {
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
            <TouchableOpacity style={styles.mediaOption}>
              <Text style={styles.mediaIcon}>📷</Text>
              <Text style={styles.mediaText}>Upload Picture</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.mediaOption}>
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

          <View style={styles.mediaModalFooter}>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => {
                setShowMediaModal(false);
                router.replace('/(tabs)');
              }}
            >
              <Text style={styles.continueButtonText}>Continue without media</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

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
