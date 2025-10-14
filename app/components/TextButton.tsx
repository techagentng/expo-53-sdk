import React from "react";
import { TouchableOpacity, Text, Image, StyleSheet, View, ViewStyle, TextStyle, ImageSourcePropType, ImageStyle } from "react-native";
import { COLORS } from "@/constants";

interface TextButtonProps {
  buttonContainerStyle?: ViewStyle;
  label?: string;
  labelStyle?: TextStyle;
  icon?: ImageSourcePropType;
  iconStyle?: ImageStyle;
  onPress?: () => void;
  disabled?: boolean;
}

const TextButton = ({
  buttonContainerStyle,
  label,
  labelStyle,
  icon,
  iconStyle,
  onPress,
  disabled,
}: TextButtonProps) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        ...buttonContainerStyle,
      }}
      disabled={disabled}
      onPress={onPress}
    >
      <View style={{ marginRight: 20 }} />
      <Text style={{ ...labelStyle }}>{label}</Text>
      {icon && (
        <Image
          source={icon}
          style={[
            {
              marginLeft: 5,
              width: 20,
              height: 20,
              tintColor: COLORS.black,
            },
            iconStyle,
          ]}
        />
      )}
    </TouchableOpacity>
  );
};

export default TextButton;
