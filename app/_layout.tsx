import { store } from '../Redux/store';
import { initializeAuth } from '../Redux/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider, useDispatch } from 'react-redux';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from '../provider/AuthContext';
import Disclaimer from './Disclaimer';

// Keep the splash screen visible while we fetch resources
// SplashScreen.preventAutoHideAsync(); // Remove this - plugin handles it

// Create an AppInitializer component that uses Redux
function AppInitializer({ onInitialized }: { onInitialized: (isAuthenticated: boolean) => void }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 Starting app initialization...');

        // Initialize Redux state with stored authentication data
        await dispatch(initializeAuth() as any);

        // Wait a bit for Redux state to update
        setTimeout(() => {
          try {
            const state = store.getState();
            const hasUser = !!state.auth?.user;
            const hasToken = !!state.auth?.access_token;

            console.log(`🔍 Redux state check: User=${hasUser}, Token=${hasToken}`);
            console.log('User data:', state.auth?.user);

            if (hasUser && hasToken) {
              console.log('✅ User is authenticated');
              onInitialized(true);
            } else {
              console.log('❌ No valid authentication found');
              onInitialized(false);
            }
          } catch (error) {
            console.error('❌ Redux state access error:', error);
            onInitialized(false);
          }
        }, 1000); // Give more time for Redux to update

      } catch (error) {
        console.error('❌ App initialization error:', error);
        onInitialized(false);
      }
    };

    // Start initialization immediately
    initializeApp();
  }, [dispatch, onInitialized]);

  return null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [initialRoute, setInitialRoute] = useState<string | null>(null);
  const [initTimeout, setInitTimeout] = useState(false);

  // Fallback timeout to prevent infinite loading
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('⏰ Initialization timeout reached');
      setInitTimeout(true);
    }, 5000); // 5 second maximum

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    console.log('🔄 Layout effect triggered:', { isAuthenticated, isReady, initialRoute, initTimeout });

    const decideInitialRoute = async () => {
      if ((isAuthenticated !== null && !isReady) || initTimeout) {
        try {
          const accepted = await AsyncStorage.getItem('disclaimerAccepted');
          // If disclaimer not accepted yet, show Disclaimer first
          const route = !accepted ? 'Disclaimer' : (isAuthenticated ? '(tabs)' : 'onboarding');
          setInitialRoute(route);

          console.log(`🎯 Setting initial route: ${route} (timeout: ${initTimeout})`);

          // Clear any existing navigation state
          AsyncStorage.removeItem('navigationState').catch(console.warn);

          setIsReady(true);
        } catch (e) {
          console.warn('Failed to read disclaimerAccepted:', e);
          // Fallback to previous behavior on error
          const route = isAuthenticated ? '(tabs)' : 'onboarding';
          setInitialRoute(route);
          setIsReady(true);
        }
      }
    };

    decideInitialRoute();
  }, [isAuthenticated, isReady, initTimeout]);

  // Show loading screen while initializing (with timeout fallback)
  if (!isReady || !initialRoute) {
    console.log('⏳ Showing loading screen:', { isReady, initialRoute, initTimeout });

    // Show disclaimer screen during initialization instead of blank screen
    if (!isReady && !initTimeout) {
      return (
        <SafeAreaProvider>
          <ErrorBoundary>
            <Provider store={store}>
              <AuthProvider>
                <Disclaimer isLoading={true} />
              </AuthProvider>
            </Provider>
          </ErrorBoundary>
        </SafeAreaProvider>
      );
    }

    // Fallback to null if timeout reached
    return null;
  }

  console.log('✅ App ready, rendering with route:', initialRoute);

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <Provider store={store}>
          <AuthProvider>
            <AppInitializer onInitialized={setIsAuthenticated} />
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen
                  name="onboarding"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen name="Disclaimer" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="ComplainSuccess" />
                <Stack.Screen name="screens/InitialSignUp" />
                <Stack.Screen name="MainScreen" />
                <Stack.Screen name="screens/Authentication/SignUp" />
                <Stack.Screen name="screens/Authentication/SignIn" />
                <Stack.Screen name="screens/Authentication/UserName" />
                <Stack.Screen name="screens/Authentication/ProfilePics" />
                <Stack.Screen name="screens/Authentication/EmailSuccess" />
                <Stack.Screen name="screens/Authentication/Interest" />
                <Stack.Screen name="screens/Authentication/SignUpMethod" />
                <Stack.Screen name="screens/Authentication/Otp" />
                <Stack.Screen name="screens/Authentication/ForgetPassword" />
                <Stack.Screen name="screens/Authentication/SignUpSuccess" />
                <Stack.Screen name="screens/HotspotSearch" />
                <Stack.Screen name="screens/SettingsWrapper" />
                <Stack.Screen name="screens/Settings" />
                <Stack.Screen name="screens/DataSaver" />
                <Stack.Screen name="screens/ReportContainer/MakeReport" />
                <Stack.Screen name="screens/AudioRecordScreen" />
              </Stack>
            </ThemeProvider>
          </AuthProvider>
        </Provider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
