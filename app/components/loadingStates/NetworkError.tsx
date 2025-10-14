import React from "react";
import { Image, StyleSheet, Text, View, ViewStyle } from "react-native";
import { icons } from "../../../constants";

interface NetworkErrorProps {
  message?: string;
  containerStyle?: ViewStyle;
}

const NetworkError: React.FC<NetworkErrorProps> = ({
  message = "ERROR!!!",
  containerStyle
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Image
        source={icons.networkSignal || require("../../../assets/images/citizenx.png")}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.errorText}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 100,
    height: 100,
    alignSelf: "center",
  },
  errorText: {
    color: "red",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default NetworkError;
