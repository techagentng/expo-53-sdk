import { store } from '@/Redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import ErrorBoundary from './components/ErrorBoundary';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isReady, setIsReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    async function prepare() {
      try {
        // Check if user has a valid session
        const accessToken = await AsyncStorage.getItem('access_token');
        const userDetails = await AsyncStorage.getItem('user_details');

        if (accessToken && userDetails) {
          // User is logged in, go to main app
          setInitialRoute('(tabs)');
          console.log('User session found, navigating to tabs');
        } else {
          // No valid session, start from onboarding
          setInitialRoute('onboarding');
          console.log('No user session found, navigating to onboarding');
        }

        // Clear any existing navigation state to prevent conflicts
        await AsyncStorage.removeItem('navigationState');
      } catch (e) {
        console.warn('Error checking user session:', e);
        // Default to onboarding on error
        setInitialRoute('onboarding');
      } finally {
        // Tell the application to render
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!isReady || !initialRoute) {
    return null; // Or a loading screen
  }

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <Provider store={store}>
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
              <Stack.Screen name="screens/Authentication/ResetPasswordEmail" />
              <Stack.Screen name="screens/Authentication/ResetPassword" />
            </Stack>
          </ThemeProvider>
        </Provider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
