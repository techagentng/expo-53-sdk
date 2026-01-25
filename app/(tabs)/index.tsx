import React from 'react';
import HomeScreen from '../screens/HomeScreen';
import { AuthGuard } from '../../components/AuthGuard';

export default function HomeTab() {
  return (
    <AuthGuard>
      <HomeScreen />
    </AuthGuard>
  );
}
