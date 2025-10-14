import { View, Text, TextInput, KeyboardTypeOptions, InputModeOptions } from "react-native";
import React from "react";
import { FONTS, SIZES, COLORS } from "@/constants";

interface FormInputProps {
  containerStyle?: any;
  formInputStyle?: any;
  label?: string;
  placeholder?: string;
  inputStyle?: any;
  value?: string;
  prependComponent?: React.ReactNode;
  appendComponent?: React.ReactNode;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoComplete?: "off" | "username" | "password" | "email" | "name" | "tel" | "street-address" | "postal-code" | "cc-number";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  errorMsg?: string;
  multiline?: boolean;
  inputMode?: InputModeOptions;
}

const FormInput = ({
  containerStyle = {},
  formInputStyle = {},
  label,
  placeholder = "",
  inputStyle = {},
  value = "",
  prependComponent = null,
  appendComponent = null,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  autoComplete = "off",
  autoCapitalize = "none",
  errorMsg = "",
  multiline = false,
  inputMode = "text",
}: FormInputProps) => {
  return (
    <View
      style={{
        ...containerStyle,
      }}
    >
      {/* Label & Error msg */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            color: COLORS.gray,
            fontWeight: "400",
            fontSize: 15,
          }}
        >
          {label}
        </Text>
        <Text
          style={{
            color: COLORS.red,
            fontWeight: "400",
          }}
        >
          {errorMsg}
        </Text>
      </View>

      {/* Text Input */}
      <View
        style={{
          flexDirection: "row",
          height: 55,
          paddingHorizontal: SIZES.padding,
          marginTop: SIZES.base,
          borderRadius: 10,
          backgroundColor: COLORS.lightGray2,
          borderWidth: 1.5, // Add border width here
          borderColor: "#0E9C67", // Optional: add a border color
          ...formInputStyle,
        }}
      >
        {prependComponent}
        <TextInput
          style={{
            flex: 1,
            ...inputStyle,
          }}
          placeholder={placeholder}
          placeholderTextColor={COLORS.gray}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoComplete={autoComplete}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          value={value}
          inputMode={inputMode}
          onChangeText={(text) => onChangeText?.(text)}
        />
        {appendComponent}
      </View>
    </View>
  );
};

export default FormInput;
