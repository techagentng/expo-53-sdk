import React from 'react';
import { View } from 'react-native';
import HotSpot from '../screens/HotSpot';
import { AuthGuard } from '../../components/AuthGuard';

export default function MapTab() {
  return (
    <AuthGuard>
      <View style={{ flex: 1 }}>
        <HotSpot />
      </View>
    </AuthGuard>
  );
}
