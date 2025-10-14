import { COLORS, SIZES } from "@/constants";
import React from "react";
import { Text, TextInput, TextInputProps, View, ViewStyle } from "react-native";

interface TextDescProps {
  containerStyle?: ViewStyle;
  inputmode?: TextInputProps['inputMode'];
  onChange: (text: string) => void;
  value: string;
  placeholder?: string;
}

const TextDesc: React.FC<TextDescProps> = ({
  containerStyle,
  inputmode = "text",
  onChange,
  value,
  placeholder,
}) => {
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
          onChangeText={onChange}
          value={value}
          placeholder={placeholder}
          multiline
        />
      </View>
    </View>
  );
};

export default TextDesc;