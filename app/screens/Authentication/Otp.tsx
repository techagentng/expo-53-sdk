import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  Image,
} from "react-native";
import { SIZES, COLORS, icons } from "@/constants";
import TextButton from "@/components/TextButton";
import OTPInputView from "@twotalltotems/react-native-otp-input";

interface OtpProps {
  navigation: any;
}

const Otp: React.FC<OtpProps> = ({ navigation }) => {
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    let interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 0) {
          return prevTimer - 1;
        } else {
          return prevTimer;
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{
          justifyContent: "flex-start",
          marginBottom: 10,
          marginLeft: 12,
        }}
        onPress={() => navigation.goBack()}
      >
        <Text style={{ fontSize: 24, color: "black" }}>←</Text>
      </TouchableOpacity>
      <Text
        style={{
          textAlign: "center",
          fontWeight: "700",
          fontSize: 16,
        }}
      >
        OTP Authentication
      </Text>
      <Text
        style={{
          textAlign: "center",
          color: "black",
          marginTop: 2,
          fontWeight: "500",
          fontSize: 14,
        }}
      >
        An authentication code has been sent to your email address
      </Text>
      <View
        style={{
          flex: 1,
          marginTop: SIZES.padding * 2,
        }}
      >
        <OTPInputView
          pinCount={4}
          style={{
            width: "100%",
            height: 50,
          }}
          codeInputFieldStyle={{
            width: 65,
            height: 65,
            borderRadius: SIZES.radius,
            backgroundColor: COLORS.lightGray2,
            color: COLORS.black,
            fontWeight: "600",
            fontSize: 20,
          }}
          onCodeFilled={(code) => {
            console.log(code);
          }}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: SIZES.padding,
          }}
        >
          <Text
            style={{
              color: COLORS.darkGray,
              fontWeight: "600",
              fontSize: 16,
            }}
          >
            Didn't receive code?
          </Text>
          <TextButton
            label={`Resend (${timer}s)`}
            disabled={timer !== 0}
            buttonContainerStyle={{
              marginLeft: SIZES.base,
              backgroundColor: "transparent",
            }}
            labelStyle={{
              color: "#0E9C67",
              fontWeight: "700",
              fontSize: 16,
            }}
            onPress={() => setTimer(60)}
          />
        </View>
      </View>
      <View>
        <TextButton
          label="Continue"
          buttonContainerStyle={{
            height: 50,
            alignItems: "center",
            borderRadius: SIZES.radius,
            backgroundColor: "#0E9C67",
          }}
          labelStyle={{
            color: COLORS.white,
            fontWeight: "700",
            fontSize: 17,
          }}
          onPress={() => navigation.navigate("MainScreen")}
        />
      </View>
      <View
        style={{
          marginTop: SIZES.padding,
          alignItems: "center",
          marginBottom: 18,
        }}
      >
        <Text
          style={{
            color: COLORS.darkGray,
            fontWeight: "700",
            fontSize: 15,
            marginRight: 7,
          }}
        >
          By signing up, you agree to our
        </Text>
        <TextButton
          label="Terms and Conditions"
          buttonContainerStyle={{
            backgroundColor: "transparent",
          }}
          labelStyle={{
            color: "#0E9C67",
            fontWeight: "700",
            fontSize: 15,
          }}
          onPress={() => console.log("To do terms and conditions")}
        />
      </View>
    </View>
  );
};

export default Otp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 45,
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});
