import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  Linking,
  Dimensions,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SIZES, COLORS, icons } from "@/constants";
import TextButton from "@/components/TextButton";
import TextIconButton from "@/components/TextIconButton";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import axios from "axios";
import { LOGIN_WITH_GOOGLE } from "@/Redux/URL";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

WebBrowser.maybeCompleteAuthSession();

const SignUpMethod = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "1089518464102-r4upttig1g193o85v3nkqae937ppk0h0.apps.googleusercontent.com",
    iosClientId:
      "1089518464102-qdgrc9ulmneip0l4cj1ijc2igv8bubvk.apps.googleusercontent.com",
  });

  const getUserInfo = async (token: string) => {
    setLoading(true);
    try {
      const res = await axios.get(LOGIN_WITH_GOOGLE, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { access_token, refresh_token } = res.data;

      await AsyncStorage.setItem("access_token", access_token);
      await AsyncStorage.setItem("refresh_token", refresh_token);
      await AsyncStorage.setItem('didLogin', 'true');

      router.replace("/(tabs)");
    } catch (error) {
      console.error("Google login error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      Alert.alert("Google login error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (response?.type === "success" && !isRequesting) {
      setIsRequesting(true);
      const { authentication } = response;
      if (authentication?.accessToken) {
        getUserInfo(authentication.accessToken);
      }
    }
  }, [response]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={{ fontSize: 20, color: "black" }}>←</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Choose Sign up option</Text>
        <Text style={styles.subtitle}>Join Citizen X today!</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TextButton
          label="Continue with email"
          disabled={loading}
          buttonContainerStyle={styles.emailButton}
          labelStyle={styles.buttonLabel}
          onPress={() => router.push("/screens/Authentication/SignUp" as any)}
        />
        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.orText}>Or</Text>
          <View style={styles.line} />
        </View>
      </View>
      <View>
        {/* Social login buttons temporarily disabled due to missing icon assets */}
        {/* <TextIconButton
          disabled={loading}
          containerStyle={{
            height: 50,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: SIZES.radius,
            backgroundColor: COLORS.blue,
            marginBottom: 18,
          }}
          icon="📘"
          iconPosition="LEFT"
          iconStyle={{
            tintColor: COLORS.white,
          }}
          label="Continue with Facebook"
          labelStyle={{
            marginLeft: SIZES.radius,
            color: COLORS.white,
          }}
          onPress={() => {}}
        />

        {loading ? (
          <View style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <TextIconButton
            disabled={loading}
            containerStyle={{
              height: 50,
              alignItems: "center",
              justifyContent: "center",
              marginTop: SIZES.radius,
              borderRadius: SIZES.radius,
              backgroundColor: COLORS.lightGray2,
              borderWidth: 1,
            }}
            icon={icons.google}
            iconPosition="LEFT"
            iconStyle={{
              tintColor: undefined,
            }}
            label="Continue with Google"
            labelStyle={{
              marginLeft: SIZES.radius,
            }}
            onPress={async () => await promptAsync()}
          />
        )} */}
      </View>
      <View
        style={{
          marginTop: SIZES.padding * 0.5,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            color: COLORS.darkGray,
            fontWeight: "400",
            fontSize: 11,
            marginRight: 2,
          }}
        >
          By signing up, you agree to our
        </Text>
        <TextButton
          label="Terms of Service"
          buttonContainerStyle={{
            backgroundColor: 'transparent',
          }}
          labelStyle={{
            color: "#0E9C67",
            fontWeight: "400",
            fontSize: 11,
          }}
          onPress={() => Linking.openURL("https://www.citizenx.ng/terms")}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            color: COLORS.darkGray,
            fontWeight: "400",
            fontSize: 11,
            marginHorizontal: 5,
          }}
        >
          and
        </Text>
        <TextButton
          label="Privacy Policy"
          buttonContainerStyle={{
            backgroundColor: 'transparent',
          }}
          labelStyle={{
            color: "#0E9C67",
            fontWeight: "400",
            fontSize: 11,
          }}
          onPress={() => Linking.openURL("https://www.citizenx.ng/privacy")}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          marginTop: "auto",
          marginBottom: 3,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: COLORS.darkGray,
            fontWeight: "600",
            fontSize: 16,
          }}
        >
          Already have an account?
        </Text>

        <TextButton
          label="Sign In"
          buttonContainerStyle={{
            //marginLeft: 2,
            backgroundColor: 'transparent',
          }}
          labelStyle={{
            color: "#0E9C67",
            fontWeight: "700",
            fontSize: 18,
          }}
          onPress={() => router.push("/screens/Authentication/SignIn" as any)}
        />
      </View>
    </SafeAreaView>
  );
};

export default SignUpMethod;

const styles = StyleSheet.create<{
  container: ViewStyle;
  header: ViewStyle;
  backButton: ViewStyle;
  icon: ImageStyle;
  textContainer: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  buttonContainer: ViewStyle;
  emailButton: ViewStyle;
  buttonLabel: TextStyle;
  divider: ViewStyle;
  line: ViewStyle;
  orText: TextStyle;
  facebookButton: ViewStyle;
  googleButton: ViewStyle;
  googleLabel: TextStyle;
  footer: ViewStyle;
  footerText: TextStyle;
  signInButton: ViewStyle;
  signInLabel: TextStyle;
}>({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: 10,
  },
  icon: {
    width: 20,
    height: 20,
  } as ImageStyle,
  textContainer: {
    marginTop: height * 0.05,
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: "700",
    color: COLORS.black,
  },
  subtitle: {
    fontSize: width * 0.04,
    marginTop: 5,
    color: COLORS.darkGray,
  },
  buttonContainer: {
    marginTop: height * 0.02,
  },
  emailButton: {
    height: 55,
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    width: "100%",
  },
  buttonLabel: {
    fontSize: width * 0.045,
    color: COLORS.white,
    fontWeight: "700",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.gray,
  },
  orText: {
    marginHorizontal: 10,
    fontSize: width * 0.04,
    color: COLORS.gray,
  },
  facebookButton: {
    marginTop: 10,
    height: 50,
    justifyContent: "center",
    backgroundColor: COLORS.blue,
    borderRadius: 10,
  },
  googleButton: {
    marginTop: 10,
    height: 50,
    justifyContent: "center",
    backgroundColor: COLORS.lightGray1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  googleLabel: {
    marginLeft: 10,
    fontSize: width * 0.045,
    color: COLORS.black,
  },
  footer: {
    marginTop: "auto",
    alignItems: "center",
  },
  footerText: {
    fontSize: width * 0.04,
    color: COLORS.darkGray,
  },
  signInButton: {
    backgroundColor: 'transparent',
  },
  signInLabel: {
    fontSize: width * 0.045,
    color: COLORS.primary,
    fontWeight: "700",
  },
});
