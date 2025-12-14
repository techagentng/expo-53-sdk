import { View, Text, StyleSheet, StatusBar, Image } from "react-native";
import React from "react";
import { icons, COLORS, SIZES } from "@/constants";
import TextButton from "@/components/TextButton";
import { useRouter, useLocalSearchParams } from "expo-router";

const SignUpSuccess = () => {
  const router = useRouter();
  const { fullname } = useLocalSearchParams<{ fullname: string }>();

  return (
    <View style={styles.container}>
      <View style={styles.itemContainer}>
        <View
          style={{
            width: 260,
            height: 260,
            backgroundColor: "#e8f5e8",
            borderRadius: 130,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 120 }}>🎉</Text>
        </View>
        <View style={styles.textConatiner}>
          <Text
            style={{
              fontWeight: "700",
              fontSize: 23,
              lineHeight: 28,
              textAlign: "center",
            }}
          >
            Sign-up successful
          </Text>
          <Text
            style={{
              fontWeight: "600",
              fontSize: 17,
              lineHeight: 20,
              textAlign: "center",
            }}
          >
            Welcome{fullname ? `, ${fullname}` : ''}!
          </Text>
        </View>
        <TextButton
          label="Continue"
          buttonContainerStyle={{
            height: 55,
            width: 300,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 65,
            borderRadius: SIZES.radius,
            backgroundColor: COLORS.primary,
          }}
          labelStyle={{
            color: COLORS.white,
            fontWeight: "700",
            fontSize: 17,
          }}
          onPress={() => {
            router.replace("/screens/Authentication/SignIn" as any);
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 45,
    backgroundColor: COLORS.white2,
    alignItems: "center",
    justifyContent: "center",
  },
  itemContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  textConatiner: {
    marginBottom: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 260,
    height: 260,
  },
});

export default SignUpSuccess;
