import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Linking,
  Dimensions,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define colors
const COLORS = {
  white: '#FFFFFF',
  red: '#FF0000',
  green: '#104833',
} as const;

// Define your icons
const icons = {
  citizenx: require('@/assets/images/citizenx.png'),
};

const { width, height } = Dimensions.get("window");

// TextButton component
const TextButton: React.FC<{
  label: string;
  onPress: () => void;
  buttonContainerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}> = ({ label, onPress, buttonContainerStyle, labelStyle }) => (
  <TouchableOpacity
    style={[styles.buttonContainer, buttonContainerStyle]}
    onPress={onPress}
  >
    <Text style={[styles.buttonLabel, labelStyle]}>{label}</Text>
  </TouchableOpacity>
);

const Disclaimer = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContent}>
        <View style={styles.secondaryContainer}>
          <Image
            source={icons.citizenx}
            resizeMode="contain"
            style={styles.logo}
          />
          <Text style={styles.title}>Citizen X</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.disclaimerTitle}>We Disclaim:</Text>
          <Text style={styles.description}>
            CitizenX Nigeria is an independent community reporting and KPI
            platform, not affiliated with any government entity. All information
            is user-generated, and we do not provide official government services
            or information. For official resources, please refer directly to
            government websites. We are committed to empowering citizens by
            providing a platform for transparent reporting and community
            engagement.
          </Text>
        </View>

        <TextButton
          label="Get Started"
          buttonContainerStyle={styles.buttonContainer}
          labelStyle={styles.buttonLabel}
          onPress={async () => {
            try {
              await AsyncStorage.setItem('disclaimerAccepted', 'true');
              // @ts-ignore - expo-router types are not fully compatible yet
              router.replace('/onboarding');
            } catch (error) {
              console.error('Failed to save disclaimer status:', error);
            }
          }}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>FOR MORE INFORMATION</Text>
        <View style={styles.linkContainer}>
          <Text style={styles.footerText}>Visit :</Text>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL("https://www.citizenx.ng/disclaimer")
            }
          >
            <Text style={styles.linkText}>
              www.citizenx.ng/disclaimer
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: width * 0.05,
  },
  secondaryContainer: {
    alignItems: "center",
    marginBottom: height * 0.05,
  },
  logo: {
    width: width * 0.15,
    height: width * 0.15,
  },
  title: {
    fontSize: width * 0.065,
    fontWeight: "700",
    marginTop: 15,
  },
  textContainer: {
    // No longer need extra padding as it's on the main container
  },
  disclaimerTitle: {
    fontSize: width * 0.06,
    fontWeight: "600",
    lineHeight: width * 0.07,
    color: COLORS.red,
    textAlign: "center",
    marginBottom: height * 0.02,
  },
  description: {
    fontSize: width * 0.045,
    lineHeight: width * 0.06,
    fontWeight: "400",
    textAlign: "center",
  },
  buttonContainer: {
    height: height * 0.07,
    alignItems: "center",
    justifyContent: "center",
    marginTop: height * 0.05,
    borderRadius: width * 0.03,
    backgroundColor: COLORS.green,
    width: '100%',
  },
  buttonLabel: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: width * 0.045,
  },
  footer: {
    height: height * 0.15,
    backgroundColor: COLORS.green,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
  },
  footerText: {
    color: COLORS.white,
    fontSize: width * 0.04,
    fontWeight: "600",
  },
  linkContainer: {
    flexDirection: "row",
    marginTop: 5,
  },
  linkText: {
    color: COLORS.white,
    fontSize: width * 0.04,
    fontWeight: "600",
    textDecorationLine: "underline",
    marginLeft: 5,
  },
});

export default Disclaimer;
