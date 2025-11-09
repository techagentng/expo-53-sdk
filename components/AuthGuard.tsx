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
  const [redirecting, setRedirecting] = useState(false);
  const [checkedStorage, setCheckedStorage] = useState(false);

  // Debug: Log auth state changes
  useEffect(() => {
    console.log('🔐 AuthGuard state:', { 
      isAuthenticated, 
      isLoading, 
      hydrating, 
      redirecting, 
      checkedStorage,
      timestamp: new Date().toISOString()
    });
  }, [isAuthenticated, isLoading, hydrating, redirecting, checkedStorage]);

  useEffect(() => {
    const hydrateIfNeeded = async () => {
      if (!isAuthenticated && !checkedStorage) {
        const token = await AsyncStorage.getItem('access_token');
        console.log('🔐 AuthGuard: Checking AsyncStorage token:', !!token);
        if (token) {
          console.log('🔐 AuthGuard: Token found in AsyncStorage, hydrating...');
          setHydrating(true);
          try {
            await refreshAuth();
            console.log('🔐 AuthGuard: Hydration complete');
          } finally {
            setHydrating(false);
            setCheckedStorage(true);
          }
        } else {
          console.log('🔐 AuthGuard: No token in AsyncStorage');
          setCheckedStorage(true);
        }
      }
    };
    hydrateIfNeeded();
  }, [isAuthenticated, refreshAuth, checkedStorage]);

  // If unauthenticated, navigate in an effect to avoid 'cannot update a component' during render
  // IMPORTANT: Only redirect after we've checked AsyncStorage
  useEffect(() => {
    const checkAndRedirect = async () => {
      if (!isAuthenticated && !redirecting && !isLoading && !hydrating && checkedStorage) {
        // Double-check AsyncStorage before redirecting to prevent false positives
        const token = await AsyncStorage.getItem('access_token');
        const user = await AsyncStorage.getItem('user_details');
        
        console.log('🔍 AuthGuard: Checking redirect condition:', { 
          hasToken: !!token, 
          hasUser: !!user,
          isAuthenticated,
          checkedStorage,
          timestamp: new Date().toISOString()
        });
        
        if (!token) {
          console.log('⚠️ AuthGuard: User not authenticated and no token in storage, redirecting to onboarding');
          setRedirecting(true);
          router.replace('/onboarding');
        } else {
          console.log('⚠️ AuthGuard: Redux says not authenticated but token exists in storage, attempting to rehydrate');
          setHydrating(true);
          try {
            await refreshAuth();
            console.log('✅ AuthGuard: Rehydration completed');
          } catch (error) {
            console.error('❌ AuthGuard: Rehydration failed:', error);
          } finally {
            setHydrating(false);
          }
        }
      }
    };
    checkAndRedirect();
  }, [isAuthenticated, redirecting, isLoading, hydrating, checkedStorage, refreshAuth]);

  if (isLoading || hydrating) {
    return fallback || (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0E9C67" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return fallback || (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0E9C67" />
      </View>
    );
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
