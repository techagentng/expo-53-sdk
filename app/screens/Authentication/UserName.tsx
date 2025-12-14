import React, { useState } from "react";
import { COLORS, SIZES, icons } from "@/constants";
import AuthLayoutSignUp from "./AuthLayoutSignUp";
import FormInput from "@/components/FormInput";
import TextButton from "@/components/TextButton";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

const UserName = () => {
  const router = useRouter();
  const { fullname, email, phoneNumber, password, referralCode } = useLocalSearchParams<{
    fullname: string;
    email: string;
    phoneNumber: string;
    password: string;
    referralCode: string;
  }>();
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");

  function isEnableSignUp() {
    return username !== "";
  }

  return (
    <AuthLayoutSignUp
      steps="Personalization"
      title="Create your username"
      subTitle="Create your unique Citizen X username."
      containerStyle={{
        paddingTop: 35,
      }}
    >
      <View
        style={{
          flex: 1,
          marginTop: 35,
        }}
      >
        <FormInput
          label="Username"
          placeholder="Obi Shegun Aminu"
          containerStyle={{
            marginTop: SIZES.radius,
          }}
          onChangeText={setUsername}
          error={usernameError}
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
                    username == ""
                      ? COLORS.gray
                      : username != "" && usernameError == ""
                      ? COLORS.green
                      : COLORS.red,
                }}
              >
                {username == "" || (username != "" && usernameError == "")
                  ? "✓"
                  : "✗"}
              </Text>
            </View>
          }
        />

        <TextButton
          label="Next"
          disabled={isEnableSignUp() ? false : true}
          buttonContainerStyle={{
            height: 55,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 45,
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
              pathname: "/screens/Authentication/ProfilePics",
              params: { fullname, email, phoneNumber, password, username, referralCode }
            } as any)
          }
        />
      </View>
    </AuthLayoutSignUp>
  );
};

export default UserName;
