import { View, Text, TextInput } from "react-native";
import React from "react";
import { FONTS, SIZES, COLORS } from "../constants";

const FormInput = ({
  containerStyle,
  formInputStyle,
  label,
  placeholder,
  inputStyle,
  value,
  prependComponent,
  appendComponent,
  onChange,
  secureTextEntry,
  keyboardType = "default",
  autoCompleteType = "off",
  autoCapitalize = "none",
  errorMsg = "",
  multiline,
  inputMode = "text",
}) => {
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
          autoCompleteType={autoCompleteType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          value={value}
          inputMode={inputMode}
          onChangeText={(text) => onChange(text)}
        />
        {appendComponent}
      </View>
    </View>
  );
};

export default FormInput;
