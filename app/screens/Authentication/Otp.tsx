import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  Image,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { router } from 'expo-router';
import { SIZES, COLORS, icons } from "@/constants";
import TextButton from "@/components/TextButton";

interface OtpProps {
  navigation: any;
}

const Otp: React.FC<OtpProps> = ({ navigation }) => {
  const [timer, setTimer] = useState(60);
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef<TextInput[]>([]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-focus previous input on backspace (empty value)
    if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Check if OTP is complete
    if (newOtp.every(digit => digit !== '')) {
      console.log('OTP Complete:', newOtp.join(''));
    }
  };

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
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          paddingHorizontal: 20,
        }}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                if (ref) inputRefs.current[index] = ref;
              }}
              style={{
                width: 65,
                height: 65,
                borderRadius: SIZES.radius,
                backgroundColor: COLORS.lightGray2,
                color: COLORS.black,
                fontWeight: "600",
                fontSize: 20,
                textAlign: 'center',
                borderWidth: 1,
                borderColor: digit ? '#0E9C67' : COLORS.lightGray1,
              }}
              value={digit}
              onChangeText={(value) => handleOtpChange(index, value)}
              keyboardType="numeric"
              maxLength={1}
            />
          ))}
        </View>
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
          onPress={() => router.replace('/(tabs)')}
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
