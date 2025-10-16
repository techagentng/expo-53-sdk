import {
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Modal,
  Vibration,
  Linking,
} from "react-native";
import React, { useState } from "react";
import { SIZES, COLORS, icons } from "@/constants";
import FormInput from "@/components/FormInput";
import { validateEmail } from "@/utils/validation";
import CustomSwitch from "@/components/CustomSwitch";
import TextButton from "@/components/TextButton";
import { StatusBar } from "react-native";
import LoadingImage from "@/components/loadingStates/LoadingImage";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SIGNIN } from "@/Redux/URL";
import { useRouter } from "expo-router";

const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [saveMe, setSaveMe] = useState(false);

  function isEnableSignIn() {
    return email !== "" && password !== "" && emailError === "";
  }

  async function signInFn() {
    setLoading(true);
    console.log('🚀 Starting sign-in process...');

    try {
      console.log('📡 Making API request to:', SIGNIN);
      console.log('📧 Login data:', { email, password: '***hidden***' });
      console.log('🌐 Request config:', {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      console.log('🔍 Testing network connectivity...');
      try {
        await axios.get('https://httpbin.org/get', { timeout: 5000 });
        console.log('✅ Network connectivity test passed');
      } catch (networkError) {
        console.log('⚠️ Network connectivity test failed:', networkError instanceof Error ? networkError.message : String(networkError));
      }

      console.log('🔄 Sending request...');
      const response = await axios.post(SIGNIN, {
        email,
        password,
      }, {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
        // Note: Removed httpsAgent for React Native compatibility
        // If SSL issues persist, we'll need a different approach
      });

      console.log('✅ API response received:', response.status);
      console.log('📦 Response data:', response.data);
      console.log('🔍 Response headers:', response.headers);

      if (response.status === 200) {
        const { access_token, refresh_token } = response.data.data;

        if (!access_token || !refresh_token) {
          throw new Error("Invalid response: Missing authentication tokens");
        }

        console.log('🔑 Storing tokens...');
        await AsyncStorage.setItem("access_token", access_token);
        await AsyncStorage.setItem("refresh_token", refresh_token);

        console.log('✅ Tokens stored, navigating to tabs...');
        setLoading(false);
        router.replace("/(tabs)" as any);
      } else {
        throw new Error(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      setLoading(false);
      console.error('❌ Sign-in failed:', error);

      if (axios.isAxiosError(error)) {
        console.log('🔍 Axios error details:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
          code: error.code,
          config: error.config,
          request: error.request
        });

        if (error.code === 'ECONNABORTED') {
          console.log('⏱️ Request timeout detected');
          setErrorMessage("Request timed out. The server might be down or slow to respond.");
        } else if (error.response) {
          // Server responded with error status
          const message = error.response.data?.message ||
                         error.response.data?.errors ||
                         `Server error: ${error.response.status}`;

          console.log('🚨 Server error response:', message);
          console.log('🔍 Error response data:', error.response.data);
          console.log('🔍 Error response status:', error.response.status);
          setErrorMessage(message);
        } else if (error.request) {
          console.log('🌐 Network error - request made but no response');
          console.log('🔍 Request details:', error.request);
          console.log('🔍 Error code:', error.code);
          setErrorMessage("Network error. Please check your internet connection and try again.");
        } else {
          console.log('💥 Axios setup error:', error.message);
          setErrorMessage("Request setup error. Please try again.");
        }
      } else {
        console.log('🚨 Non-axios error:', error);
        setErrorMessage("An unexpected error occurred. Please try again.");
      }

      console.log('📱 Showing error modal...');
      setErrorModal(true);
      Vibration.vibrate();
    }
  }

  if (loading) return <LoadingImage />;

  return (
    <ScrollView
      style={{ backgroundColor: COLORS.white }}
      contentContainerStyle={styles.container}
    >
      <TouchableOpacity
        style={{
          marginTop: 15,
          marginBottom: 10,
          marginLeft: 15,
          backgroundColor: COLORS.white,
          borderRadius: 20,
          width: 40,
          height: 40,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={() => router.back()}
      >
        <Text style={{ fontSize: 24, color: "black" }}>←</Text>
      </TouchableOpacity>
      <View
        style={{
          flex: 1,
          paddingTop: SIZES.padding * 0.5,
          paddingHorizontal: 17,
          backgroundColor: COLORS.white,
        }}
      >
        <View style={styles.imageContainer}>
          <Image
            source={require("@/assets/images/citizenx.png")}
            resizeMode="contain"
            style={{
              width: 65,
              height: 65,
            }}
          />
          <Text style={styles.titleText}>CITIZEN-X</Text>
        </View>
        {/** Email Form Inputs */}
        <FormInput
          label="Email"
          keyboardType="email-address"
          autoComplete="email"
          value={email}
          onChangeText={(value) => {
            validateEmail(value, setEmailError);
            setEmail(value);
          }}
          error={emailError}
          rightIcon={
            <View
              style={{
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color:
                    email === ""
                      ? COLORS.gray
                      : email !== "" && emailError === ""
                      ? COLORS.green
                      : COLORS.red,
                }}
              >
                {email === "" || (email !== "" && emailError === "")
                  ? "✓"
                  : "✗"}
              </Text>
            </View>
          }
        />

        <FormInput
          label="Password"
          secureTextEntry={!showPass}
          autoComplete="password"
          value={password}
          containerStyle={{
            marginTop: SIZES.radius,
          }}
          onChangeText={(value) => setPassword(value)}
          rightIcon={
            <TouchableOpacity
              onPress={() => setShowPass(!showPass)}
            >
              <Text style={{ fontSize: 16, color: COLORS.gray }}>
                {showPass ? "🙈" : "👁️"}
              </Text>
            </TouchableOpacity>
          }
        />

        {/** Save me & Forget Password */}
        <View
          style={{
            flexDirection: "row",
            marginTop: SIZES.radius,
            justifyContent: "space-between",
          }}
        >
          <CustomSwitch value={saveMe} onValueChange={(value) => setSaveMe(value)} />
          <TextButton
            label="Forgot Password?"
            buttonContainerStyle={{
              backgroundColor: "transparent",
            }}
            labelStyle={{
              color: COLORS.gray,
              fontWeight: "600",
            }}
            onPress={() => Linking.openURL("https://www.citizenx.ng/forgot")}
          />
        </View>
        
        {/** Sign In */}
        <TextButton
          label="Sign In"
          disabled={!isEnableSignIn()}
          buttonContainerStyle={{
            height: 55,
            alignItems: "center",
            justifyContent: "center",
            marginTop: SIZES.padding,
            borderRadius: SIZES.radius,
            backgroundColor: isEnableSignIn() ? "#0E9C67" : COLORS.invisible,
          }}
          labelStyle={{
            color: COLORS.white,
            fontWeight: "700",
            fontSize: 17,
          }}
          onPress={signInFn}
        />
        
        {/** Sign up */}
        <View
          style={{
            flexDirection: "row",
            marginTop: 25,
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
            Don't have an account?
          </Text>

          <TextButton
            label="Sign Up"
            buttonContainerStyle={{
              backgroundColor: "transparent",
            }}
            labelStyle={{
              color: "#0E9C67",
              fontWeight: "700",
              fontSize: 18,
            }}
            onPress={() => {
              router.push("/screens/Authentication/SignUp" as any);
            }}
          />
        </View>
      </View>

      {/** Error Modal */}
      <Modal animationType="slide" transparent={true} visible={errorModal}>
        <View style={styles.modalContainer}>
          <View
            style={{
              height: 90,
              width: 90,
              marginTop: 5,
              backgroundColor: "#ffebee",
              borderRadius: 12,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 50 }}>⚠️</Text>
          </View>

          <View style={styles.logoutTextContainer}>
            <Text style={styles.primaryText}>Login Failed</Text>
            <Text style={styles.secondaryText}>{errorMessage}</Text>
          </View>
          <TextButton
            label="Dismiss"
            buttonContainerStyle={{
              height: 55,
              width: "80%",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 30,
              borderRadius: SIZES.radius,
              backgroundColor: COLORS.primary,
            }}
            labelStyle={{
              color: COLORS.white,
              fontWeight: "700",
              fontSize: 18,
            }}
            onPress={() => setErrorModal(false)}
          />
        </View>
      </Modal>
    </ScrollView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: StatusBar.currentHeight || 45,
    backgroundColor: COLORS.white,
  },
  image: {
    width: 65,
    height: 65,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
  },
  titleText: {
    fontSize: 12.1,
    fontWeight: "500",
    color: "#000000",
  },
  modalContainer: {
    width: "98%",
    height: 320,
    backgroundColor: COLORS.white,
    alignSelf: "center",
    marginTop: "auto",
    marginBottom: 7,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: COLORS.gray2,
    paddingHorizontal: 8,
  },
  logoutTextContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  primaryText: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 25,
  },
  secondaryText: {
    fontSize: 15,
    fontWeight: "400",
    lineHeight: 20,
    textAlign: "center",
    marginVertical: 10,
  },
});
