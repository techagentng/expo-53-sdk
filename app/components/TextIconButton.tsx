import { View, Text, TouchableOpacity, Image, StyleSheet, ImageSourcePropType } from "react-native";
import React from "react";
import { COLORS } from "@/constants";

interface TextIconButtonProps {
  containerStyle?: any;
  label?: string;
  labelStyle?: any;
  icon?: ImageSourcePropType | null;
  iconPosition?: "LEFT" | "RIGHT";
  iconStyle?: any;
  onPress?: () => void;
  disabled?: boolean;
}

const TextIconButton = ({
  containerStyle,
  label,
  labelStyle,
  icon,
  iconPosition,
  iconStyle,
  onPress,
  disabled
}: TextIconButtonProps) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        ...containerStyle,
      }}
      onPress={onPress}
      disabled={disabled}
    >
      {iconPosition == "LEFT" && icon && (
        <Image
          source={icon}
          style={{
            ...styles.image,
            ...iconStyle,
          }}
        />
      )}

      <Text
        style={{
          fontWeight: "400",
          fontSize: 16,
          ...labelStyle,
        }}
      >
        {label}
      </Text>

      {iconPosition == "RIGHT" && icon && (
        <Image
          source={icon}
          style={{
            ...styles.image,
            ...iconStyle,
          }}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  image: {
    marginLeft: 5,
    width: 20,
    height: 20,
    tintColor: COLORS.black,
  },
});
export default TextIconButton;
