import { View, Text } from "react-native";
import React from "react";
import RNPickerSelect from "react-native-picker-select";
import { SIZES, COLORS } from "@/constants";

const InsidentType = ({
  insidenType,
  setInsidentType,
  //labelType,
  label,
  insident,
  containerStyle,
}: {
  insidenType: string;
  setInsidentType: (value: string) => void;
  label: string;
  insident: Array<{ label: string; value: string }>;
  containerStyle?: any;
}) => {
  return (
    <View
      style={{
        width: "100%",
        justifyContent: "flex-start",
        paddingVertical: 10,
        ...containerStyle,
      }}
    >
      <Text
        style={{
          fontSize: 14,
          fontWeight: "600",
          lineHeight: 20,
          color: COLORS.darkGray,
        }}
      >
        {label}
      </Text>
      <View
        style={{
          width: "100%",
          borderWidth: 0.5,
          borderRadius: 10,
          borderColor: COLORS.darkGray2,
        }}
      >
        <RNPickerSelect
          placeholder={{ label: "Select type of incident", value: null }}
          onValueChange={(value) => setInsidentType(value)}
          items={insident}
        />
      </View>
    </View>
  );
};

export default InsidentType;
