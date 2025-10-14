import { StyleSheet, Text, View, Switch } from "react-native";
import React, { useState } from "react";
import SettingsWrapper from "./SettingsWrapper";
import { COLORS } from "@/constants";

const DataSaver = () => {
  const [autoPlayVideo, setAutoPlayVideo] = useState(false);
  const [autoPlayAudio, setAutoPlayAudio] = useState(false);
  const togglePlayVideo = () =>
    setAutoPlayVideo((previousState) => !previousState);
  const togglePlayAudio = () =>
    setAutoPlayAudio((previousState) => !previousState);
  return (
    <SettingsWrapper title="Notification">
      <View style={styles.container}>
        <Text style={styles.textContainer}>Autoplay Video</Text>
        <View style={styles.switchContainer}>
          <Switch
            trackColor={{ false: "#767577", true: `${COLORS.primary}` }}
            thumbColor={autoPlayVideo ? `${COLORS.primary}` : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={togglePlayVideo}
            value={autoPlayVideo}
          />
        </View>
      </View>
      <View style={styles.container}>
        <Text style={styles.textContainer}>Autoplay Audio</Text>
        <View style={styles.switchContainer}>
          <Switch
            trackColor={{ false: "#767577", true: `${COLORS.primary}` }}
            thumbColor={autoPlayAudio ? `${COLORS.primary}` : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={togglePlayAudio}
            value={autoPlayAudio}
          />
        </View>
      </View>
    </SettingsWrapper>
  );
};

export default DataSaver;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 25,
  },
  switchContainer: {
    transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
  },
  textContainer: {
    fontWeight: "500",
    fontSize: 16,
    color: "#000000CC",
  },
});
