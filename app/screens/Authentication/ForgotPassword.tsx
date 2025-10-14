import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StatusBar } from "react-native";
//import { AuthLayout } from "../";
import { SIZES, COLORS, icons } from "@/constants";
import FormInput from "@/components/FormInput";   
import { validateEmail } from "@/utils/validation";
import TextButton from "@/components/TextButton";
import AuthLayoutSignUp from "./AuthLayoutSignUp";
import axios from "axios";
import { FORGET_PASSWORD } from "@/Redux/URL";
import LoadingImage from "@/components/loadingStates/LoadingImage";
import ErrorImage from "@/components/loadingStates/ErrorImage";
import NetworkError from "@/components/loadingStates/NetworkError";
import { StyleSheet } from "react-native";

interface ForgotPasswordProps {
  navigation: any;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [emailError, setEmailError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function isEnableSendEmail() {
    return email !== "" && emailError === "";
  }
  
  async function forgetPassfnc(email: string) {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(FORGET_PASSWORD, {
        email,
      });

      if (response.status === 200) {
        setLoading(false);
        navigation.navigate("EmailSuccess", { email });
      }
    } catch (error) {
      setLoading(false);
      
      if (axios.isAxiosError(error)) {
        setError(error);
        if (error.response) {
          const message = error.response.data?.message || error.response.data || "There was an issue with the server. Please try again later.";
          setErrorMessage(message);
        } else if (error.request) {
          setErrorMessage("Network error. Please check your internet connection and try again.");
        } else {
          setErrorMessage("An unexpected error occurred. Please try again.");
        }
      } else {
        setError(error);
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  }

  if (loading) return <LoadingImage />;

  if (error.response) {
    return (
      <View style={styles.errorStyle}>
        <ErrorImage />
        <Text style={{ color: "red", fontSize: 10, fontWeight: "400" }}>
          {errorMessage}
        </Text>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <TextButton
            label="Go Back"
            buttonContainerStyle={{
              height: 50,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 20,
              borderRadius: SIZES.radius,
              backgroundColor: "#0E9C67",
            }}
            labelStyle={{
              color: COLORS.white,
              fontWeight: "700",
              fontSize: 18,
            }}
            onPress={() => {
              navigation.goBack();
            }}
          />
        </View>
      </View>
    );
  } else if (error.request) {
    return (
      <View style={styles.errorStyle}>
        <NetworkError />
        <Text style={{ color: "red", fontSize: 12, fontWeight: "400" }}>
          {errorMessage}
        </Text>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <TextButton
            label="Go Back"
            buttonContainerStyle={{
              height: 50,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 20,
              borderRadius: SIZES.radius,
              backgroundColor: "#0E9C67",
            }}
            labelStyle={{
              color: COLORS.white,
              fontWeight: "700",
              fontSize: 18,
            }}
            onPress={() => {
              navigation.goBack();
            }}
          />
        </View>
      </View>
    );
  } else if (error) {
    return (
      <View style={styles.errorStyle}>
        <ErrorImage />
        <Text style={{ color: "red", fontSize: 12, fontWeight: "400" }}>
          {errorMessage}
        </Text>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <TextButton
            label="Go Back"
            buttonContainerStyle={{
              height: 50,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 20,
              borderRadius: SIZES.radius,
              backgroundColor: "#0E9C67",
            }}
            labelStyle={{
              color: COLORS.white,
              fontWeight: "700",
              fontSize: 18,
            }}
            onPress={() => {
              navigation.goBack();
            }}
          />
        </View>
      </View>
    );
  }
  return (
    <AuthLayoutSignUp
      title="Password Recovery"
      subTitle="Please enter your email address to recover your password"
      containerStyle={{
        marginTop: StatusBar.currentHeight || 45,
      }}
    >
      {/** Form Input */}

      <View
        style={{
          flex: 1,
          marginTop: SIZES.padding * 2,
        }}
      >
        <FormInput
          label="Email"
          keyboardType="email-address"
          autoComplete="email"
          value={email}
          onChangeText={(value) => {
            // validate email
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
      </View>

      {/** Button */}
      <TextButton
        label="Send Email"
        disabled={!isEnableSendEmail()}
        buttonContainerStyle={{
          height: 55,
          alignItems: "center",
          marginBottom: SIZES.padding,
          marginTop: 45,
          borderRadius: SIZES.radius,
          backgroundColor: isEnableSendEmail() ? "#0E9C67" : COLORS.invisible,
        }}
        labelStyle={{
          color: COLORS.white,
          fontWeight: "700",
          fontSize: 17,
        }}
        onPress={async () => {
          await forgetPassfnc(email);
        }}
      />
    </AuthLayoutSignUp>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  errorStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
});
