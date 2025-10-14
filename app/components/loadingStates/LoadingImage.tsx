import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, ViewStyle } from "react-native";
import { icons } from "@/constants";

interface LoadingImageProps {
  containerStyle?: ViewStyle;
}

const LoadingImage: React.FC<LoadingImageProps> = ({ containerStyle }) => {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const blink = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    blink.start();

    return () => blink.stop();
  }, [opacity]);

  return (
    <View style={[styles.container, containerStyle]}>
      <Animated.Image
        source={icons.citizenx || require("@/assets/images/citizenx.png")}
        style={[styles.image, { opacity }]}
        resizeMode="contain"
      />
    </View>
  );
};

export default LoadingImage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
});
