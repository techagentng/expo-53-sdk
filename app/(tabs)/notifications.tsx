import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/constants';
import { AuthGuard } from '../../components/AuthGuard';

export default function NotificationsTab() {
  return (
    <AuthGuard>
      <View style={styles.container}>
        <Text style={styles.title}>Alerts</Text>
        <Text style={styles.subtitle}>Notifications and alerts center...</Text>
      </View>
    </AuthGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray2,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.darkGray,
    textAlign: 'center',
  },
});
