import { ThemedView } from '@/components/themed-view';
import onboardingData from '@/data/data';
import { router } from 'expo-router';
import React from "react";
import {
  Image,
  StyleSheet,
  useColorScheme,
  View
} from "react-native";
import Onboarding from 'react-native-onboarding-swiper';

const OnboardingScreen = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleGetStarted = () => {
    // Directly navigate to InitialSignUp without storing onboarding status
    router.replace('/screens/InitialSignUp');
  };

  const colors = {
    dark: ['#1a237e', '#004d40', '#4a148c', '#6a1b9a'],
    light: ['#e8eaf6', '#e0f2f1', '#f3e5f5', '#f3e5f9']
  };

  const pages = onboardingData.map((item, index) => ({
    backgroundColor: isDark ? colors.dark[index % 4] : colors.light[index % 4],
    image: (
      <View style={styles.imageContainer}>
        <Image
          source={item.image}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    ),
    title: item.title,
    titleStyles: [styles.title, {
      color: isDark ? '#fff' : colors.dark[index % 4]
    }],
    subTitleStyles: [styles.subtitle, isDark && styles.darkSubtitle],
    subtitle: item.text,
  }));

  return (
    <ThemedView style={styles.container}>
      <Onboarding
        pages={pages}
        onDone={handleGetStarted}
        onSkip={handleGetStarted}
        showSkip={true}
        bottomBarHighlight={false}
        bottomBarHeight={100}
        containerStyles={styles.onboardingContainer}
        imageContainerStyles={styles.onboardingImageContainer}
      />
    </ThemedView>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  onboardingContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 30,
  },
  onboardingImageContainer: {
    paddingBottom: 0,
    flex: 0.6,
    justifyContent: 'flex-end',
  },
  imageContainer: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 30,
    color: '#666',
  },
  darkSubtitle: {
    color: '#aaa',
  },
});