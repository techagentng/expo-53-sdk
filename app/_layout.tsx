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

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Create an AppInitializer component that uses Redux
function AppInitializer({ onInitialized }: { onInitialized: (isAuthenticated: boolean) => void }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 Starting app initialization...');

        // Simple AsyncStorage check first
        const accessToken = await AsyncStorage.getItem('access_token');
        const userDetails = await AsyncStorage.getItem('user_details');

        if (accessToken && userDetails) {
          console.log('📱 Found stored credentials, initializing Redux...');

          // Initialize Redux state with stored data
          await dispatch(initializeAuth() as any);

          // Quick state check
          setTimeout(() => {
            try {
              const state = store.getState();
              const hasUser = !!state.auth?.user;
              const hasToken = !!state.auth?.access_token;

              console.log(`🔍 Redux state: User=${hasUser}, Token=${hasToken}`);

              if (hasUser && hasToken) {
                console.log('✅ User is authenticated');
                onInitialized(true);
              } else {
                console.log('⚠️ Stored credentials found but Redux state incomplete');
                onInitialized(false);
              }
            } catch (error) {
              console.error('❌ Redux state access error:', error);
              onInitialized(false);
            }
          }, 500);
        } else {
          console.log('📱 No stored credentials found');
          onInitialized(false);
        }
      } catch (error) {
        console.error('❌ App initialization error:', error);
        onInitialized(false);
      }
    };

    // Start initialization after a short delay to ensure everything is loaded
    const timer = setTimeout(initializeApp, 100);
    return () => clearTimeout(timer);
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

    if ((isAuthenticated !== null && !isReady) || initTimeout) {
      // Determine initial route based on authentication status
      const route = isAuthenticated ? '(tabs)' : 'onboarding';
      setInitialRoute(route);

      console.log(`🎯 Setting initial route: ${route} (timeout: ${initTimeout})`);

      // Clear any existing navigation state
      AsyncStorage.removeItem('navigationState').catch(console.warn);

      // Hide splash screen and mark as ready
      setIsReady(true);
      SplashScreen.hideAsync().catch(console.warn);
    }
  }, [isAuthenticated, isReady, initTimeout]);

  // Show loading screen while initializing (with timeout fallback)
  if (!isReady || !initialRoute) {
    console.log('⏳ Showing loading screen:', { isReady, initialRoute, initTimeout });
    return null;
  }

  console.log('✅ App ready, rendering with route:', initialRoute);

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <Provider store={store}>
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
        </Provider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
