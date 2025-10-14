import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { COLORS } from "@/constants";

const Task = () => {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Tasks</Text>
        <Text style={{ marginLeft: 80, ...styles.titleText }}>Points</Text>
        <Text style={styles.titleText}>You gots</Text>
      </View>

      <View style={styles.videoContainer}>
        <Text style={styles.text}>Video Report</Text>
        <Text style={styles.text}>4X points</Text>
        <Text style={styles.text}>12</Text>
      </View>

      <View style={styles.videoContainer}>
        <Text style={styles.text}>Audio Report</Text>
        <Text style={styles.text}>25X points</Text>
        <Text style={styles.text}>-</Text>
      </View>

      <View style={styles.videoContainer}>
        <Text style={styles.text}>Follow-up Report</Text>
        <Text style={{ ...styles.text, marginRight: 30 }}>2X points</Text>
        <Text style={styles.text}>4</Text>
      </View>

      <View style={styles.instantReportContainer}>
        <Text style={styles.text}>Instant Report Time</Text>
        <Text style={{ ...styles.text, marginRight: 40 }}>4X point</Text>
        <Text style={styles.text}>16</Text>
      </View>
    </View>
  );
};

export default Task;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    backgroundColor: COLORS.white,
    flex: 1,
    paddingHorizontal: 5,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
    borderBottomWidth: 1.5,
    borderColor: COLORS.gray,
  },
  videoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 60,
    borderBottomWidth: 1.5,
    borderColor: COLORS.gray,
  },
  instantReportContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 60,
  },
  titleText: {
    fontWeight: "700",
    fontSize: 15,
    color: "#00000080",
  },
  text: {
    fontWeight: "700",
    fontSize: 14,
    color: "#000000CC",
  },
});
