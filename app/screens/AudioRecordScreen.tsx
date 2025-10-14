import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { Audio } from "expo-av";
import { COLORS, icons } from "@/constants";

const AudioRecordScreen = ({ route, navigation }: any) => {
  const { setStoredRecording } = route.params;
  const [recording, setRecording] = useState<Audio.Recording | undefined>(undefined);
  const [recordedURI, setRecordedURI] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const spinValue = useRef(new Animated.Value(0)).current;

  // Audio Recording
  async function startRecording() {
    try {
      if (permissionResponse?.status !== "granted") {
        console.log("Requesting permission..");
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setTimer(0); // Reset timer
      console.log("Recording started");

      // Start timer
      startTimer();

      // Start spin animation
      startSpinAnimation();
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    console.log("Stopping recording..");
    if (!recording) return;
    
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    setRecordedURI(uri);
    setStoredRecording(uri);
    console.log("Recording stopped and stored at", uri);
    console.log(recording);

    // Stop timer
    stopTimer();

    // Stop spin animation
    stopSpinAnimation();
  }

  const startSpinAnimation = () => {
    spinValue.setValue(0);
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  };

  const stopSpinAnimation = () => {
    Animated.timing(spinValue, { toValue: 0, duration: 1000, useNativeDriver: true }).stop();
  };

  // Timer Functionality
  useEffect(() => {
    let interval: number | null = null;
    if (recording) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime + 1);
      }, 1000);
    } else if (interval !== null) {
      clearInterval(interval);
    }
    return () => {
      if (interval !== null) clearInterval(interval);
    };
  }, [recording]);

  const startTimer = () => setTimer(0);
  const stopTimer = () => setTimer(0);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? "0" + mins : mins}:${secs < 10 ? "0" + secs : secs}`;
  };

  // Spin Animation Interpolation
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.parentButtonConatiner,
          recording ? styles.parentrecordingStop : styles.parentrecordStart,
        ]}
        onPress={() => {
          recording ? stopRecording() : startRecording();
        }}
      >
        <Animated.View
          style={[
            styles.buttonContainer,
            recording ? styles.buttonStop : styles.buttonStart,
            { transform: recording ? [{ rotate: spin }] : [] },
          ]}
        >
          {recording ? (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              {icons.microphone_slash ? (
                <Image
                  source={icons.microphone_slash}
                  style={{ width: 75, height: 75, tintColor: "white" }}
                />
              ) : (
                <View
                  style={{
                    width: 75,
                    height: 75,
                    backgroundColor: "white",
                    borderRadius: 10,
                  }}
                />
              )}
              <Text style={styles.text}>Recording...</Text>
              <Text style={styles.text}>Click to stop</Text>
              <Text style={styles.timerText}>{formatTime(timer)}</Text>
            </View>
          ) : (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              {icons.microphoneicon ? (
                <Image
                  source={icons.microphoneicon}
                  style={{ width: 75, height: 75, tintColor: "white" }}
                />
              ) : (
                <View
                  style={{
                    width: 75,
                    height: 75,
                    backgroundColor: "white",
                    borderRadius: 10,
                  }}
                />
              )}
              <Text style={styles.text}>Start Record</Text>
            </View>
          )}
        </Animated.View>
      </TouchableOpacity>

      {/* Footer with Recorded Audio Options */}
      {recordedURI && (
        <View style={styles.footer}>
          <Text style={styles.footerText}>Recorded Audio:</Text>
          <TouchableOpacity
            style={styles.playButton}
            onPress={async () => {
              const { sound } = await Audio.Sound.createAsync({
                uri: recordedURI,
              });
              await sound.playAsync();
            }}
          >
            <Text style={styles.playButtonText}>Play</Text>
          </TouchableOpacity>

          <View style={styles.footerButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setRecordedURI(null);
                setStoredRecording(null);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => {
                navigation.goBack(); // Save and navigate back
              }}
            >
              <Text style={styles.saveButtonText}>Save & Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default AudioRecordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  parentButtonConatiner: {
    backgroundColor: "white",
    width: 170,
    height: 170,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
  },
  buttonContainer: {
    width: 150,
    height: 150,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  parentrecordStart: {
    backgroundColor: COLORS.white2,
  },
  parentrecordingStop: {
    backgroundColor: "#28a7c9",
  },
  buttonStart: {
    backgroundColor: COLORS.primary,
  },
  buttonStop: {
    backgroundColor: "#f72346",
  },
  text: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.white,
  },
  timerText: {
    fontSize: 14,
    color: COLORS.lightGray1,
    marginTop: 5,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    width: "90%",
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  footerText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.black,
    marginBottom: 10,
  },
  playButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  playButtonText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: "600",
  },
  footerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    backgroundColor: "#f72346",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  cancelButtonText: {
    fontSize: 14,
    color: COLORS.white,
    textAlign: "center",
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 8,
    flex: 1,
  },
  saveButtonText: {
    fontSize: 14,
    color: COLORS.white,
    textAlign: "center",
  },
});
