import React from "react";
import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const SIZES = {
  small: 12,
  medium: 16,
  large: 20,
  radius: 10,
  padding: 16,
} as const;

const COLORS = {
  darkGray: '#666666',
  white: '#FFFFFF',
} as const;

const { width, height } = Dimensions.get("window");

const InitialSignUp: React.FC = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.semiContainer}>
        <Image
          source={require("@/assets/images/citizenx.png")}
          resizeMode="contain"
          style={styles.logo}
        />
        <Text style={styles.imageTitle}>Citizen X</Text>

        <View style={styles.textContainer}>
          <Text style={styles.titleContainer}>
            Be part of the Citizen X community, become the force for change.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.createAccountButton}
            onPress={() => router.push("/screens/Authentication/SignUp" as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.createAccountLabel}>Create an account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => router.push("/(tabs)" as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.continueLabel}>Continue without an account</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.signInContainer}>
          <Text style={styles.alreadyAccountText}>Already have an account?</Text>
          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => router.push("/screens/Authentication/SignIn" as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.signInLabel}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default InitialSignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    paddingHorizontal: "5%",
    paddingVertical: "5%",
  },
  semiContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: height * 0.05,
  },
  logo: {
    height: height * 0.1,
    width: width * 0.4,
  },
  imageTitle: {
    fontSize: SIZES.large,
    fontWeight: '700',
    marginTop: 10,
  },
  textContainer: {
    marginTop: height * 0.03,
    alignItems: "center",
  },
  titleContainer: {
    color: COLORS.darkGray,
    fontWeight: "600",
    fontSize: SIZES.medium,
    textAlign: "center",
    lineHeight: 25,
  },
  buttonContainer: {
    width: "100%",
    marginTop: height * 0.05,
    marginBottom: height * 0.1,
  },
  createAccountButton: {
    height: 55,
    justifyContent: "center",
    borderRadius: SIZES.radius,
    backgroundColor: "#104833",
    width: "100%",
    marginBottom: SIZES.padding,
  },
  createAccountLabel: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: SIZES.medium,
    textAlign: 'center',
    width: '100%',
  },
  continueButton: {
    height: 55,
    justifyContent: "center",
    borderRadius: SIZES.radius,
    borderWidth: 2,
    borderColor: '#104833',
    marginTop: 10,
    width: "100%",
  },
  continueLabel: {
    color: "#104833",
    fontWeight: "700",
    fontSize: SIZES.medium,
    textAlign: "center",
  },
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
    paddingBottom: 20,
  },
  alreadyAccountText: {
    color: COLORS.darkGray,
    fontWeight: "700",
    fontSize: SIZES.small,
    marginRight: 5,
  },
  signInButton: {
    backgroundColor: 'transparent',
  },
  signInLabel: {
    color: "#104833",
    fontWeight: "700",
    fontSize: SIZES.medium,
  },
});
