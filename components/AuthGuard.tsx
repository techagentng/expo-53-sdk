import React, { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '../provider/AuthContext';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * AuthGuard component that protects routes requiring authentication
 * Shows a loading spinner while checking authentication status
 * Redirects to onboarding if user is not authenticated
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ children, fallback }) => {
  const { isAuthenticated, isLoading, refreshAuth } = useAuth();
  const [hydrating, setHydrating] = useState(false);

  useEffect(() => {
    const hydrateIfNeeded = async () => {
      if (!isAuthenticated) {
        const token = await AsyncStorage.getItem('access_token');
        if (token) {
          setHydrating(true);
          try {
            await refreshAuth();
          } finally {
            setHydrating(false);
          }
        }
      }
    };
    hydrateIfNeeded();
  }, [isAuthenticated, refreshAuth]);

  if (isLoading || hydrating) {
    return fallback || (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0E9C67" />
      </View>
    );
  }

  if (!isAuthenticated) {
    router.replace('/onboarding');
    return null;
  }

  return <>{children}</>;
};

/**
 * GuestGuard component that shows content only to unauthenticated users
 * Useful for login/signup screens
 */
export const GuestGuard: React.FC<AuthGuardProps> = ({ children, fallback }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return fallback || (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0E9C67" />
      </View>
    );
  }

  if (isAuthenticated) {
    // User is authenticated, don't show guest content
    return null;
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
