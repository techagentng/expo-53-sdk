import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Alert,
  Image,
  ActivityIndicator,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import AuthLayoutSignUp from "./AuthLayoutSignUp";
import { COLORS, icons, SIZES } from "@/constants";
import TextButton from "@/components/TextButton";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import LoadingImage from "@/components/loadingStates/LoadingImage";
import axios from "axios";
import { SIGNUP } from "@/Redux/URL";
import { Vibration } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfilePics = () => {
  const router = useRouter();
  const { fullname, email, phoneNumber, password, username, referralCode } = useLocalSearchParams<{
    fullname: string;
    email: string;
    phoneNumber: string;
    password: string;
    username: string;
    referralCode: string;
  }>();
  const [profileImage, setProfileImage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState(false);

  const mediaAccess = async () => {
    try {
      setImageLoading(true);
      // const { status } = await MediaLibrary.requestPermissionsAsync();
      // if (status !== "granted") {
      //   Alert.alert(
      //     "Sorry, we need media library permissions to access your photos."
      //   );
      //   setImageLoading(false);
      //   return;
      // }

      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
      } else {
        Alert.alert("You did not select any image.");
      }
    } catch (error) {
      //console.error("Error accessing media library: ", error);
      Alert.alert("Error accessing media library", error instanceof Error ? error.message : String(error));
    } finally {
      setImageLoading(false);
    }
  };

  // useEffect(() => {
  //   if (error) {
  //     Alert.alert("Sign Up failed", "There was an issue signing you up.");
  //     console.log(error);
  //   }
  // }, [error]);

  const signUpFnc = async () => {
    console.log("🚀 Signup: Starting with params:", { fullname, email, phoneNumber, username, referralCode });
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("fullname", fullname || "");
      formData.append("telephone", phoneNumber || "");
      formData.append("username", username || "");
      formData.append("email", email || "");
      formData.append("password", password || "");
      if (profileImage) {
        const fileType = profileImage.substring(
          profileImage.lastIndexOf(".") + 1
        );
        formData.append("profile_image", {
          uri: profileImage,
          type: `image/${fileType}`,
          name: `profile_image.${fileType}`,
        } as any);
      }
      // Add referralCode if provided
      if (referralCode && referralCode.trim() !== "") {
        formData.append("referralCode", referralCode.trim());
      }

      console.log("Form Data before sending to server:", formData);
      const response = await axios.post(SIGNUP, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201 || response.status === 200) {
        console.log("Signup response data:", response.data);
        
        // Store tokens from signup response
        const { access_token, refresh_token, ...userData } = response.data.data || {};
        if (access_token) {
          await AsyncStorage.setItem("access_token", access_token);
          console.log("✅ Signup: Access token stored");
        }
        if (refresh_token) {
          await AsyncStorage.setItem("refresh_token", refresh_token);
          console.log("✅ Signup: Refresh token stored");
        }
        if (userData) {
          await AsyncStorage.setItem("user_details", JSON.stringify(userData));
          console.log("✅ Signup: User details stored");
        }
        
        router.push({
          pathname: "/screens/Authentication/SignUpSuccess",
          params: { fullname }
        } as any);
      }
    } catch (error) {
      setLoading(false);
      setErrorModal(true);
      console.log("error:", error);
      Vibration.vibrate();
      console.log(error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.log("server error:", error.response.data);
          const errorMessage =
            error.response.data.errors || "An error occurred. Please try again.";
          setErrorMessage(errorMessage);
        } else if (error.request) {
          console.log("network error:", error.message);
          setErrorMessage(
            "Network error. Please check your internet connection and try again."
          );
        }
      } else {
        const message = error instanceof Error ? error.message : "An unexpected error occurred. Please try again.";
        console.log("error:", message);
        setErrorMessage(message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingImage />;

  // if (user && status === "Created") {
  //   navigation.navigate("SignUpSuccess", {
  //     fullname,
  //     email,
  //     phoneNumber,
  //     password,
  //     username,
  //   });
  //   //     dispatch(resetUserStatus());
  // }
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={{ fontSize: 24, color: "black", marginLeft: 12 }}>←</Text>
      </TouchableOpacity>
      <AuthLayoutSignUp
        steps="Personalization"
        title="Add Profile Photo"
        subTitle="Add your preferred picture or avatar "
        containerStyle={styles.authLayout}
      >
        <View style={styles.content}>
          <View style={styles.imageContainer}>
            <TouchableOpacity onPress={mediaAccess}>
              {imageLoading ? (
                <ActivityIndicator size="large" color={COLORS.primary} />
              ) : profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  resizeMode="cover"
                  style={styles.profileImage}
                />
              ) : (
                <View
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 70,
                    backgroundColor: "#f0f0f0",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 10,
                    marginTop: 18,
                  }}
                >
                  <Text style={{ fontSize: 24, color: "#666" }}>📷</Text>
                </View>
              )}
            </TouchableOpacity>
            <Text style={styles.text}>
              {profileImage
                ? "Profile Photo Added"
                : "Add Profile Photo (Optional)"}
            </Text>
          </View>

          <TextButton
            label={profileImage ? "Next" : "Skip"}
            buttonContainerStyle={styles.nextButton}
            labelStyle={styles.nextButtonLabel}
            onPress={() => {
              signUpFnc();
            }}
          />
        </View>
      </AuthLayoutSignUp>
      <Modal animationType="slide" transparent={true} visible={errorModal}>
        <View style={styles.modalContainer}>
          <View
            style={{
              height: 80,
              width: 100,
              marginTop: 8,
              backgroundColor: "#ffebee",
              borderRadius: 12,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 40 }}>⚠️</Text>
          </View>

          <View style={styles.logoutTextContainer}>
            <Text style={styles.primaryText}>Sign up failed</Text>
            <Text style={styles.secondaryText}>{errorMessage}</Text>
          </View>
          <TextButton
            label="Dismiss"
            buttonContainerStyle={{
              height: 55,
              width: "80%",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 50,
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
    </View>
  );
};

export default ProfilePics;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 45,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  text: {
    fontWeight: "800",
    fontSize: 16,
    lineHeight: 19.6,
    marginRight: 95,
    color: COLORS.primary,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 70,
    marginRight: 10,
    marginTop: 18,
  },
  authLayout: {
    paddingVertical: 20,
  },
  nextButton: {
    height: 50,
    width: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  nextButtonLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.white,
  },
  modalContainer: {
    width: "98%",
    height: 350,
    backgroundColor: "white",
    alignSelf: "center",
    marginTop: "auto",
    marginBottom: 7,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: COLORS.gray2,
  },
  imagelogoutContainer: {
    alignItems: "center",
    justifyContent: "center",

    marginTop: 10,
  },
  logoutTextContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
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
  },
});
