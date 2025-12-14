import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SIZES, COLORS, icons } from "@/constants";
import FormInput from "@/components/FormInput";
import TextButton from "@/components/TextButton";
import { validateEmail, validatePassword } from "@/utils/validation";
import AuthLayoutSignUp from "./AuthLayoutSignUp";
import { useRouter } from "expo-router";

const SignUp = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullname, setFullName] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [referralCode, setReferralCode] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [fullNameError, setFullNameError] = useState("");

  function isEnableSignUp() {
    return (
      email !== "" &&
      password !== "" &&
      fullname !== "" &&
      emailError === "" &&
      passwordError === "" &&
      phoneNumberError === "" &&
      fullNameError === ""
    );
  }

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 20 }]}>
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 15,
          left: 15,
          zIndex: 1,
          backgroundColor: COLORS.white,
          borderRadius: 20,
          width: 40,
          height: 40,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
        onPress={() => router.back()}
      >
        <Text style={{ fontSize: 24, color: "black" }}>←</Text>
      </TouchableOpacity>
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
      <AuthLayoutSignUp
        steps="Step 1 of 2"
        title="Create your Account"
        subTitle="Create your Citizen X account and be part of the journey."
        //show={true}
        //screen="SignUpMethod"
      >
        {/** Form Inputs and Sign Up */}

        <View
          style={{
            flex: 1,
            marginTop: SIZES.padding,
          }}
        >
          <FormInput
            label="Email"
            keyboardType="email-address"
            placeholder="ObiShegunAminu@mail.com"
            autoComplete="email"
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

          <FormInput
            label="Full Name"
            placeholder="Obi Shegun Aminu"
            containerStyle={{
              marginTop: SIZES.radius,
            }}
            onChangeText={(value) => {
              setFullName(value);
            }}
            error={fullNameError}
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
                      fullname == ""
                        ? COLORS.gray
                        : fullname != "" && fullNameError == ""
                        ? COLORS.green
                        : COLORS.red,
                  }}
                >
                  {fullname == "" || (fullname != "" && fullNameError == "")
                    ? "✓"
                    : "✗"}
                </Text>
              </View>
            }
          />
          {/** TODO: Fix Phone Number */}
          <FormInput
            label="Phone Number"
            inputMode="numeric"
            placeholder="08063XXXXXX"
            containerStyle={{
              marginTop: SIZES.radius,
            }}
            onChangeText={(value) => {
              setPhoneNumber(value);
            }}
            error={phoneNumberError}
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
                      phoneNumber == ""
                        ? COLORS.gray
                        : phoneNumber != "" && phoneNumberError == ""
                        ? COLORS.green
                        : COLORS.red,
                  }}
                >
                  {phoneNumber == "" ||
                  (phoneNumber != "" && phoneNumberError == "")
                    ? "✓"
                    : "✗"}
                </Text>
              </View>
            }
          />

          <FormInput
            label="Password"
            secureTextEntry={!showPass}
            placeholder="!12$ogiQ0L"
            autoComplete="password"
            containerStyle={{
              marginTop: SIZES.radius,
            }}
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

          {/* Referral Code Input */}
          <FormInput
            label="Referral Code (optional)"
            placeholder="Enter referral code"
            containerStyle={{ marginTop: SIZES.radius }}
            onChangeText={setReferralCode}
            value={referralCode}
            autoCapitalize="characters"
          />

          {/** Sign Up & Sign In */}
          <TextButton
            label="Sign Up"
            disabled={isEnableSignUp() ? false : true}
            buttonContainerStyle={{
              height: 55,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 25,
              borderRadius: SIZES.radius,
              backgroundColor: isEnableSignUp() ? "#0E9C67" : COLORS.invisible,
            }}
            labelStyle={{
              color: COLORS.white,
              fontWeight: "700",
              fontSize: 17,
            }}
            onPress={() =>
              router.push({
                pathname: "/screens/Authentication/UserName",
                params: { fullname, email, phoneNumber, password, referralCode }
              } as any)
            }
          />
        </View>
        {/** Footer */}
      </AuthLayoutSignUp>
      <View
        style={{
          flexDirection: "row",
          marginTop: "auto",
          marginBottom: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: COLORS.darkGray,
            fontWeight: "700",
            fontSize: 15,
            //marginRight: 2,
          }}
        >
          Already have an account?
        </Text>
        <TextButton
          label="Sign In"
          buttonContainerStyle={{
            backgroundColor: "transparent",
          }}
          labelStyle={{
            color: "#0E9C67",
            fontWeight: "700",
            fontSize: 18,
          }}
          onPress={() => router.push("/screens/Authentication/SignIn" as any)}
        />
      </View>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});