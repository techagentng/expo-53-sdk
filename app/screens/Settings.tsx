import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import SettingsWrapper from './SettingsWrapper';

const Settings = () => {
  const handleDataSaver = () => {
    router.push('/screens/DataSaver');
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
      </View>
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
});

export default Settings;
