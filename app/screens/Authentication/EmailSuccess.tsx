import { View, Text, StyleSheet, StatusBar, Image } from "react-native";
import React, { useEffect } from "react";
import { icons, COLORS, SIZES } from "@/constants";
import TextButton from "@/components/TextButton";
import { NavigationProp } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  EmailSuccess: { email: string };
  SignIn: undefined;
  // Add other routes as needed
};

type EmailSuccessNavigationProp = NavigationProp<RootStackParamList>;
type EmailSuccessRouteProp = RouteProp<RootStackParamList, 'EmailSuccess'>;

interface EmailSuccessProps {
  navigation: EmailSuccessNavigationProp;
  route: EmailSuccessRouteProp;
}

const EmailSuccess: React.FC<EmailSuccessProps> = ({ navigation, route }) => {
  const { email } = route.params || {};

  if (!email) {
    console.error("Missing signup information");
    return (
      <View style={styles.container}>
        <Text>Error: Missing Email information. Please try again.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.itemContainer}>
        <Text style={{ fontSize: 120 }}>📧</Text>
        <View style={styles.textConatiner}>
          <Text
            style={{
              fontWeight: "700",
              fontSize: 23,
              lineHeight: 28,
              textAlign: "center",
            }}
          >
            Email Successfully sent
          </Text>
          <Text
            style={{
              fontWeight: "600",
              fontSize: 17,
              lineHeight: 20,
              textAlign: "center",
            }}
          >
            Please, check your email {email}!
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
          onPress={() => navigation.navigate("SignIn")}
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

export default EmailSuccess;
