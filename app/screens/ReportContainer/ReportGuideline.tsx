import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
  Linking,
} from "react-native";
import React from "react";
import { router } from 'expo-router';
import { SIZES, COLORS, icons } from "@/constants";
import type { ImageSourcePropType } from "react-native";

interface ReportGuidelineProps {
  navigation: any;
}

const ReportGuideline: React.FC<ReportGuidelineProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.primaryContainer}>
      <TouchableOpacity
        onPress={() => router.replace('/(tabs)')}
        style={styles.imageContainer}
      >
        <Image
          source={(icons.arrowleft || icons.anonymous) as unknown as ImageSourcePropType}
          style={{ width: 20, height: 20, tintColor: "black" }}
        />
      </TouchableOpacity>

      <View style={styles.textContainer}>
        <Text style={styles.title}>Reporting Guide</Text>
        <Text style={styles.subTitle}>
          Create impactful reports quickly and easily. Here's how:
        </Text>
      </View>

      <View style={styles.bulletContainer}>
        <View style={styles.singleContainer}>
          <Text style={styles.bullet}>1.</Text>
          <Text style={styles.item}>
            <Text style={styles.bold}>Category & Subcategory:</Text> Choose the
            issue type (e.g., Crime, Corruption) and its specific focus (e.g.,
            Theft, Bribery).
          </Text>
        </View>

        <View style={styles.singleContainer}>
          <Text style={styles.bullet}>2.</Text>
          <Text style={styles.item}>
            <Text style={styles.bold}>Location Details:</Text> Specify the
            State, LGA, and exact location (address or landmark).
          </Text>
        </View>

        <View style={styles.singleContainer}>
          <Text style={styles.bullet}>3.</Text>
          <Text style={styles.item}>
            <Text style={styles.bold}>Event Info:</Text> Include the date and
            time, or skip it if the report is being made live, and provide a
            factual description of the issue.
          </Text>
        </View>

        <View style={styles.singleContainer}>
          <Text style={styles.bullet}>4.</Text>
          <Text style={styles.item}>
            <Text style={styles.bold}>Impact & Media Attachments:</Text>{" "}
            Describe the impact and upload supporting media (photos, videos, or
            audio).
          </Text>
        </View>

        <View style={styles.singleContainer}>
          <Text style={styles.bullet}>5.</Text>
          <Text style={styles.item}>
            <Text style={styles.bold}>Submit & Earn Points:</Text> Submit your
            report, wait for verification, and earn reward points!
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 20 }}>
        <Text style={styles.item}>
          For full guidelines, visit{" "}
          <TouchableOpacity
            onPress={() => Linking.openURL("https://www.citizenx.com/help")}
          >
            <Text style={{ color: COLORS.primary, fontWeight: "bold" }}>
              www.citizenx.com/help
            </Text>
          </TouchableOpacity>
          .
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default ReportGuideline;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 40,
    marginHorizontal: 20,
  },
  imageContainer: {
    width: 32,
    height: 30,
  },
  textContainer: {
    flexDirection: "column",
    marginTop: 20,
    justifyContent: "flex-end",
  },
  title: {
    color: `${COLORS.primary}`,
    fontWeight: "700",
    fontSize: 25,
    lineHeight: 28,
  },
  subTitle: {
    color: "#000000",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 19.6,
    marginBottom: 15,
  },
  bulletContainer: {
    marginLeft: 4,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  bullet: {
    fontSize: 20,
    marginRight: 5,
  },
  item: {
    marginTop: 0,
    marginRight: 4,
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 19.6,
  },
  singleContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginBottom: 15,
  },
  bold: {
    fontWeight: "600",
  },
});
