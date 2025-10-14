import {
    Text,
    View,
    TouchableOpacity,
    Image,
    StyleSheet,
    Alert,
    ScrollView,
    Modal,
    Vibration,
  } from "react-native";
  import React, { useState, useEffect } from "react";
  import { SIZES, COLORS, icons } from "@/constants";
  import FormInput from "@/components/FormInput";
  import TextButton from "@/components/TextButton";
  import { validatePassword } from "@/utils/validation";
  import { StatusBar } from "react-native";
  import LoadingImage from "@/components/loadingStates/LoadingImage";
  import axios from "axios";
  import { VALIDATE_TOKEN, RESET_PASSWORD_MOBILE } from "@/Redux/URL";
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import { useRouter } from "expo-router";

  const ResetPassword = ({ route }: any) => {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorModal, setErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
  
    const { email, token } = route.params;
  
    useEffect(() => {
      validateToken();
    }, []);
  
    async function validateToken() {
      try {
        const response = await axios.post(VALIDATE_TOKEN, {
          email,
          token
        });
  
        if (response.status !== 200) {
          setErrorMessage("Invalid or expired token. Please request a new password reset.");
          setErrorModal(true);
        }
      } catch (error) {
        setErrorMessage("Invalid or expired token. Please request a new password reset.");
        setErrorModal(true);
      }
    }
  
    function isEnableReset() {
      return (
        password != "" &&
        confirmPassword != "" &&
        passwordError == "" &&
        confirmPasswordError == "" &&
        password === confirmPassword
      );
    }
  
    async function handleResetPassword() {
      setLoading(true);
      try {
        const response = await axios.post(RESET_PASSWORD_MOBILE, {
          email,
          token,
          new_password: password,
          confirm_password: confirmPassword
        });
  
        if (response.status === 200) {
          setLoading(false);
          Alert.alert(
            "Success",
            "Your password has been reset successfully. You can now sign in with your new password.",
            [
              {
                text: "OK",
                onPress: () => router.push("/screens/Authentication/SignIn" as any),
              },
            ]
          );
        }
      } catch (error) {
        setLoading(false);
        setErrorModal(true);
        Vibration.vibrate();
        if (axios.isAxiosError(error)) {
          if (error.response) {
            setErrorMessage(error.response.data.message || "An error occurred. Please try again.");
          } else if (error.request) {
            setErrorMessage("Network error. Please check your internet connection and try again.");
          }
        } else {
          const message = error instanceof Error ? error.message : "An unexpected error occurred. Please try again.";
          setErrorMessage(message);
        }
      }
    }
  
    if (loading) return <LoadingImage />;
  
    return (
      <ScrollView style={styles.container}>
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
            paddingTop: SIZES.padding * 0.5,
            paddingHorizontal: 17,
          }}
        >
          <View style={styles.imageContainer}>
            <Image
              source={require("@/assets/images/citizenx.png")}
              resizeMode="contain"
              style={{
                width: 65,
                height: 65,
                borderRadius: 32.5,
              }}
            />
            <Text style={styles.titleText}>CITIZEN-X</Text>
          </View>
  
          <Text style={styles.descriptionText}>
            Please enter your new password below. Make sure it's strong and secure.
          </Text>
          <FormInput
            label="New Password"
            secureTextEntry={!showPass}
            autoComplete="password"
            onChangeText={(value) => {
              validatePassword(value, setPasswordError);
              setPassword(value);
            }}
            error={passwordError}
            rightIcon={
              <TouchableOpacity
                style={{
                  width: 40,
                  alignItems: "flex-end",
                  justifyContent: "center",
                }}
                onPress={() => setShowPass(!showPass)}
              >
                <Text style={{ fontSize: 16, color: COLORS.gray }}>
                  {showPass ? "🙈" : "👁️"}
                </Text>
              </TouchableOpacity>
            }
          />
  
          <FormInput
            label="Confirm New Password"
            secureTextEntry={!showConfirmPass}
            autoComplete="password"
            containerStyle={{
              marginTop: SIZES.radius,
            }}
            onChangeText={(value) => {
              if (value !== password) {
                setConfirmPasswordError("Passwords do not match");
              } else {
                setConfirmPasswordError("");
              }
              setConfirmPassword(value);
            }}
            error={confirmPasswordError}
            rightIcon={
              <TouchableOpacity
                style={{
                  width: 40,
                  alignItems: "flex-end",
                  justifyContent: "center",
                }}
                onPress={() => setShowConfirmPass(!showConfirmPass)}
              >
                <Text style={{ fontSize: 16, color: COLORS.gray }}>
                  {showConfirmPass ? "🙈" : "👁️"}
                </Text>
              </TouchableOpacity>
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
      </ScrollView>
    );
  };
  
  export default ResetPassword;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: StatusBar.currentHeight || 45,
      backgroundColor: COLORS.gray2,
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
    descriptionText: {
      fontSize: 16,
      color: COLORS.darkGray,
      textAlign: "center",
      marginVertical: 20,
      lineHeight: 24,
    },
    modalContainer: {
      width: "98%",
      height: 320,
      backgroundColor: "white",
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
  