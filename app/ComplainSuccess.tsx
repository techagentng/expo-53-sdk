import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Image,
} from "react-native";
import { router } from 'expo-router';
import { COLORS, SIZES, icons } from "@/constants";

const ComplainSuccess = () => {
  return (
    <View style={styles.container}>
      <View style={styles.itemContainer}>
        {icons.SignUpSuccess && (
          <Image source={icons.SignUpSuccess} style={styles.image} />
        )}
        <View style={styles.textConatiner}>
          <Text
            style={{
              fontWeight: "700",
              fontSize: 23,
              lineHeight: 28,
              textAlign: "center",
            }}
          >
            Thank youxx
          </Text>
          <Text
            style={{
              fontWeight: "600",
              fontSize: 17,
              lineHeight: 20,
              textAlign: "center",
            }}
          >
            Your report will be reviewed. You make a difference!
          </Text>
        </View>
        <TouchableOpacity
          style={{
            height: 55,
            width: 300,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 65,
            borderRadius: SIZES.radius,
            backgroundColor: COLORS.primary,
          }}
          onPress={() => {
            router.replace('/(tabs)');
          }}
        >
          <Text
            style={{
              color: COLORS.white,
              fontWeight: "700",
              fontSize: 17,
            }}
          >
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ComplainSuccess;

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
    width: 200,
    height: 200,
  },
});
