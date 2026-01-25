import React from 'react';
import { View } from 'react-native';
import Profile from '../screens/Profile';
import { AuthGuard } from '../../components/AuthGuard';

export default function ProfileTab() {
  return (
    <AuthGuard>
      <View style={{ flex: 1 }}>
        <Profile />
      </View>
    </AuthGuard>
  );
}
