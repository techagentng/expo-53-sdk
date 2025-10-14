import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import TextButton from "../../components/TextButton";
import { COLORS, SIZES, icons } from "@/constants";
import type { ImageSourcePropType } from "react-native";

interface ReportSuccessProps {
  navigation: any;
}

const ReportSuccess: React.FC<ReportSuccessProps> = ({ navigation }) => {
  // Handler to navigate to the feed section
  const goToFeed = () => navigation.navigate("MainScreen");

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.container}
      onPress={goToFeed}
    >
      <TouchableOpacity
        style={{
          marginTop: 16,
          justifyContent: "flex-start",
          marginBottom: 10,
        }}
        onPress={() => navigation.navigate("MainScreen")}
      >
        <Image
          source={(icons.arrowleft || icons.anonymous) as unknown as ImageSourcePropType}
          style={{ width: 20, height: 20, tintColor: "black" }}
        />
      </TouchableOpacity>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <View style={styles.topCircle}>
          <View style={styles.innerCircle}>
            <Image
              source={(icons.staricon || icons.anonymous) as unknown as ImageSourcePropType}
              style={{ width: 85, height: 85, tintColor: "#d49013" }}
            />
          </View>
        </View>

        <Text style={styles.titleText}>
          Your Report has been submitted successfully
        </Text>
        <Text style={styles.subTitle}>
          You have been rewarded with 4 CX points. Thank you for being a force
          for change.
        </Text>
      </View>
      <TextButton
        label="Continue"
        buttonContainerStyle={{
          height: 55,
          alignItems: "center",
          justifyContent: "center",
          marginTop: 40,
          borderRadius: SIZES.radius,
          backgroundColor: "#0E9C67",
        }}
        labelStyle={{
          color: COLORS.white,
          fontWeight: "700",
          fontSize: 17,
        }}
        onPress={goToFeed}
      />
    </TouchableOpacity>
  );
};

export default ReportSuccess;

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight || 40,
    marginHorizontal: 15,
  },
  topCircle: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 120,
    backgroundColor: "#f5dc20",
    height: 150,
    width: 150,
    borderWidth: 2,
    borderColor: "#f5dc20",
    borderRadius: 300,
  },
  innerCircle: {
    width: 110,
    height: 110,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderRadius: 50,
    backgroundColor: "#f2c729", //  #e3b612
    borderColor: "#f0a61d",
  },
  titleText: {
    marginTop: 18,
    marginBottom: 3,
    fontWeight: "700",
    fontSize: 20,
    textAlign: "center",
    color: "#000000",
    lineHeight: 28,
  },
  subTitle: {
    marginHorizontal: 10,
    textAlign: "center",
    fontWeight: "400",
    lineHeight: 19,
  },
});
