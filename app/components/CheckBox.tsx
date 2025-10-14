import { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { icons } from "@/constants";

export default function CheckBox({ checked, setChecked, label }: any) {
  function MyCheckbox({ onChange, checked }: any) {
    return (
      <Pressable style={styles.checkboxBase} onPress={onChange}>
        {checked ? (
          <>
            {icons.radioButtonChecked ? (
              <Image
                source={icons.radioButtonChecked}
                style={{ tintColor: "#0E9C67", width: 36, height: 36 }}
              />
            ) : (
              <View
                style={{
                  width: 36,
                  height: 36,
                  backgroundColor: "#0E9C67",
                  borderRadius: 18,
                }}
              />
            )}
          </>
        ) : (
          <>
            {icons.radiobuttonunchecked ? (
              <Image
                source={icons.radiobuttonunchecked}
                style={{ tintColor: "black", width: 36, height: 36 }}
              />
            ) : (
              <View
                style={{
                  width: 36,
                  height: 36,
                  backgroundColor: "transparent",
                  borderWidth: 2,
                  borderColor: "black",
                  borderRadius: 18,
                }}
              />
            )}
          </>
        )}
      </Pressable>
    );
  }

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "row",
        paddingVertical: 8,
      }}
    >
      <MyCheckbox onChange={() => setChecked()} checked={checked} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  checkboxBase: {
    backgroundColor: "white",
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },

  label: {
    fontWeight: "700",
    fontSize: 20,
    lineHeight: 20,
    marginLeft: 8,
  },
});
