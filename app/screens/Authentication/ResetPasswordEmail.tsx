import {
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Modal,
  Vibration,
} from "react-native";
import React, { useState } from "react";
import { SIZES, COLORS, icons } from "@/constants";
import FormInput from "@/components/FormInput";
import { validateEmail } from "@/utils/validation";
import TextButton from "@/components/TextButton";
import { StatusBar } from "react-native";
import LoadingImage from "@/components/loadingStates/LoadingImage";
import axios from "axios";
import { FORGET_PASSWORD_MOBILE } from "@/Redux/URL";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

const ResetPasswordEmail = () => {
  const router = useRouter();
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorModal, setErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
  
    function isEnableReset() {
      return email != "" && emailError == "";
    }
  
    async function handleResetPassword() {
      if (!email.trim()) {
        Alert.alert("Error", "Please enter your email address");
        return;
      }
      
      setLoading(true);
      try {
        console.log('Making API call to:', FORGET_PASSWORD_MOBILE);
        console.log('With data:', { email: email.trim() });
        
        const response = await axios.post(FORGET_PASSWORD_MOBILE, {
          email: email.trim()
        });
  
        console.log('Reset Password Response:', response.data);
  
        if (response.data.status === "OK" && response.data.data?.reset_token) {
          const reset_token = response.data.data.reset_token;
          
          // Store the token in AsyncStorage
          await AsyncStorage.setItem('reset_token', reset_token);
          
          setLoading(false);
          router.push("/screens/Authentication/ResetPassword" as any);
        } else {
          throw new Error(response.data.message || "Failed to get reset token");
        }
      } catch (error) {
        setLoading(false);
        console.error('Reset Password Error:', error);
        const message = error instanceof Error ? error.message : "Failed to initiate password reset";
        setErrorMessage(message);
        setErrorModal(true);
      }
    }
  
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={{
            marginTop: 15,
            justifyContent: "flex-start",
            marginBottom: 10,
            marginLeft: 15,
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
          }}
        >
          <View style={styles.imageContainer}>
            <Image
              source={require("@/assets/images/citizenx.png")}
              resizeMode="contain"
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
              }}
            />
            <Text style={styles.titleText}>CITIZEN-X</Text>
          </View>
  
          <Text style={styles.descriptionText}>
            Please enter your email address to reset your password.
          </Text>
  
          <FormInput
            label="Email"
            keyboardType="email-address"
            autoComplete="email"
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
                      email == ""
                        ? COLORS.gray
                        : email != "" && emailError == ""
                        ? COLORS.green
                        : COLORS.red,
                  }}
                >
                  {email == "" || (email != "" && emailError == "")
                    ? "✓"
                    : "✗"}
                </Text>
              </View>
            }
          />
  
          <TextButton
            label="Reset Password"
            disabled={isEnableReset() ? false : true}
            buttonContainerStyle={{
              height: 55,
              alignItems: "center",
              justifyContent: "center",
              marginTop: SIZES.padding * 2,
              borderRadius: SIZES.radius,
              backgroundColor: isEnableReset() ? "#0E9C67" : COLORS.invisible,
            }}
            labelStyle={{
              color: COLORS.white,
              fontWeight: "700",
              fontSize: 17,
            }}
            onPress={handleResetPassword}
          />
        </View>
  
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
              <Text style={styles.primaryText}>Reset Failed</Text>
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
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
    },
    imageContainer: {
      alignItems: "center",
      marginTop: SIZES.padding * 2,
    },
    image: {
      width: 100,
      height: 100,
    },
    titleText: {
      fontSize: 24,
      fontWeight: "bold",
      marginTop: SIZES.padding,
      color: COLORS.black,
    },
    descriptionText: {
      fontSize: 16,
      color: COLORS.gray,
      marginTop: SIZES.padding,
      textAlign: "center",
    },
    modalContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    logoutTextContainer: {
      alignItems: "center",
      marginTop: SIZES.padding * 2,
    },
    primaryText: {
      fontSize: 24,
      fontWeight: "bold",
      color: COLORS.black,
    },
    secondaryText: {
      fontSize: 16,
      color: COLORS.gray,
      marginTop: SIZES.padding,
      textAlign: "center",
    },
  });
  
  export default ResetPasswordEmail;