import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Linking,
  Dimensions,
  SafeAreaView,
} from "react-native";
import React from "react";
import { icons, SIZES, COLORS } from "@/constants";
import TextButton from "../components/TextButton";

const { width, height } = Dimensions.get("window");

const Disclaimer = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.secondaryContainer}>
        {icons.citizenx && (
          <Image
            source={icons.citizenx}
            resizeMode="contain"
            style={styles.logo}
          />
        )}
        <Text style={styles.title}>Citizen X</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.disclaimerTitle}>We Disclaim:</Text>
        <Text style={styles.description}>
          CitizenX Nigeria is an independent community reporting and KPI
          platform, not affiliated with any government entity. All information
          is user-generated, and we do not provide official government services
          or information. For official resources, please refer directly to
          government websites. We are committed to empowering citizens by
          providing a platform for transparent reporting and community
          engagement.
        </Text>
      </View>

      <TextButton
        label="Get Started"
        buttonContainerStyle={styles.buttonContainer}
        labelStyle={styles.buttonLabel}
        onPress={() => {
          navigation.navigate("SplashScreen");
        }}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>FOR MORE INFORMATION</Text>
        <View style={styles.linkContainer}>
          <Text style={styles.footerText}>Visit :</Text>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL("https://www.citizenx.ng/disclaimer")
            }
          >
            <Text style={styles.linkText}>
              www.citizenx.ng/disclaimer
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Disclaimer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#B7FF9D33",
  },
  secondaryContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: height * 0.07,
  },
  logo: {
    width: width * 0.15,
    height: width * 0.15,
  },
  title: {
    fontSize: width * 0.055,
    fontWeight: "600",
    lineHeight: width * 0.065,
    marginLeft: 10,
  },
  textContainer: {
    paddingHorizontal: width * 0.05,
  },
  disclaimerTitle: {
    fontSize: width * 0.06,
    fontWeight: "600",
    lineHeight: width * 0.07,
    color: COLORS.red,
    textAlign: "center",
    marginBottom: height * 0.02,
  },
  description: {
    fontSize: width * 0.045,
    lineHeight: width * 0.06,
    fontWeight: "400",
    textAlign: "center",
  },
  buttonContainer: {
    height: height * 0.07,
    alignItems: "center",
    justifyContent: "center",
    marginTop: height * 0.03,
    borderRadius: width * 0.03,
    backgroundColor: "#104833",
    alignSelf: "center",
    width: width * 0.8,
  },
  buttonLabel: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: width * 0.045,
  },
  footer: {
    marginTop: "auto",
    height: height * 0.2,
    backgroundColor: "#104833",
    width: width * 0.97,
    borderTopRightRadius: width * 0.5,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: width * 0.05,
    alignSelf: "center",
  },
  footerText: {
    color: COLORS.white,
    fontSize: width * 0.04,
    fontWeight: "600",
  },
  linkContainer: {
    flexDirection: "row",
    marginTop: 5,
  },
  linkText: {
    color: COLORS.white,
    fontSize: width * 0.04,
    fontWeight: "600",
    textDecorationLine: "underline",
    marginLeft: 5,
  },
});
