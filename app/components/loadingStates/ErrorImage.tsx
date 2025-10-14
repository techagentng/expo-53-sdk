import React from "react";
import { Image, StyleSheet, Text, View, ViewStyle } from "react-native";

interface ErrorImageProps {
  message?: string;
  containerStyle?: ViewStyle;
}

const ErrorImage = ({ 
  message = "ERROR!!!",
  containerStyle
}: ErrorImageProps): React.ReactElement => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Image
        source={require("../../../assets/images/icon.png")}
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
    marginTop: 15,
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

export default ErrorImage;
