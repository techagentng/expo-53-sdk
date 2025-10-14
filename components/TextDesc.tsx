import { StyleSheet, Text, View, TextInput } from "react-native";
import React from "react";
import { SIZES, COLORS } from "@/constants";

interface TextDescProps {
  containerStyle?: any;
  inputmode?: "text" | "numeric" | "email" | "tel" | "url" | "search" | "decimal" | "none";
  onChange: (text: string) => void;
  value: string;
  placeholder?: string;
}

const TextDesc = ({
  containerStyle,
  inputmode = "text",
  onChange,
  value,
  placeholder,
}: TextDescProps) => {
  return (
    <View
      style={{
        ...containerStyle,
      }}
    >
      <Text
        style={{
          fontSize: 14,
          fontWeight: "400",
          color: COLORS.darkGray,
        }}
      >
        Description or comment
      </Text>
      <View
        style={{
          flexDirection: "row",
          height: 213,
          paddingHorizontal: SIZES.padding,
          marginTop: SIZES.base,
          borderRadius: SIZES.radius,
          backgroundColor: COLORS.lightGray2,
          borderWidth: 0.5,
          borderColor: "#00000033",
        }}
      >
        <TextInput
          style={{
            flex: 1,
            textAlignVertical: "top",
            paddingVertical: 12,
            textAlign: "left",
            paddingLeft: 0,
          }}
          inputMode={inputmode}
          onChangeText={(text) => onChange(text)}
          value={value}
          placeholder={placeholder}
          multiline
        />
      </View>
    </View>
  );
};

export default TextDesc;
