import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image } from 'react-native';
import { router } from 'expo-router';
import { useDispatch } from 'react-redux';
import { logout } from '../../Redux/authSlice';
import SettingsWrapper from './SettingsWrapper';
import { COLORS, icons, SIZES } from '@/constants';

const Settings = () => {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);

  const handleDataSaver = () => {
    router.push('/screens/DataSaver');
  };

  const handleLogout = async () => {
    try {
      // Dispatch logout action to clear Redux state and AsyncStorage
      await dispatch(logout() as any);
      setModalVisible(false);

      // Navigate to sign in screen
      router.replace('/screens/Authentication/SignIn');
    } catch (error) {
      console.error('Logout error:', error);
      setModalVisible(false);
    }
  };

  return (
    <SettingsWrapper title="Settings">
      <View style={styles.container}>
        <TouchableOpacity style={styles.settingItem} onPress={handleDataSaver}>
          <Text style={styles.settingText}>Data Saver</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Privacy</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>About</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Help & Support</Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.settingItem, styles.logoutItem]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={[styles.settingText, styles.logoutText]}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Confirmation Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Image
                source={(icons.logouticon || icons.anonymous) as any}
                style={styles.modalIcon}
              />
            </View>

            <View style={styles.modalTextContainer}>
              <Text style={styles.modalTitle}>Already leaving?</Text>
              <Text style={styles.modalSubtitle}>Are you sure you want to logout?</Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.logoutButton]}
                onPress={handleLogout}
              >
                <Text style={[styles.modalButtonText, styles.logoutButtonText]}>
                  Yes, Logout
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.modalButtonText, styles.cancelButtonText]}>
                  No, Stay
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SettingsWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  settingItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  logoutItem: {
    marginTop: 20,
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#FF3B30',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: 'center',
    minHeight: 300,
  },
  modalHeader: {
    marginBottom: 20,
  },
  modalIcon: {
    width: 60,
    height: 60,
    tintColor: '#333',
  },
  modalTextContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#666',
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButtonText: {
    color: 'white',
  },
  cancelButtonText: {
    color: '#333',
  },
});

export default Settings;
