import { View, Text, TouchableWithoutFeedback, StyleSheet } from "react-native";
import React from "react";
import { COLORS, FONTS, SIZES } from "../constants";

const CustomSwitch = ({ value, onChange }) => {
  return (
    <TouchableWithoutFeedback onPress={() => onChange(!value)}>
      <View
        style={{
          flexDirection: "row",
        }}
      >
        {/** Switch */}
        <View
          style={value ? styles.switchOnContainer : styles.switchOffContainer}
        >
          <View
            style={{
              ...styles.dots,
              backgroundColor: value ? COLORS.white : COLORS.gray,
            }}
          />
        </View>
        {/** Text */}
        <Text
          style={{
            color: value ? "#0E9C67" : COLORS.grey,
            marginLeft: SIZES.base,
            fontWeight: "400",
          }}
        >
          Save Me
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  switchOnContainer: {
    width: 40,
    height: 20,
    paddingRight: 2,
    justifyContent: "center",
    alignItems: "flex-end",
    borderRadius: 10,
    backgroundColor: "#0E9C67",
  },
  switchOffContainer: {
    width: 40,
    height: 20,
    paddingLeft: 2,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 10,
  },
  dots: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
export default CustomSwitch;
