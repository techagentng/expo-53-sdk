import { View, Text, StyleSheet } from "react-native";
import React from "react";
import RNPickerSelect from "react-native-picker-select";
import { NigeriaStates, LocalGovernment } from "@/data/state_local";
import { COLORS, SIZES } from "@/constants";

const StateLocal = ({
  selectedState,
  setSelectedState,
  selectedLocalGov,
  setSelectedLocalGov,
  localgovernmentstyle,
  containerStyle,
}: {
  selectedState: string | null;
  setSelectedState: (value: string | null) => void;
  selectedLocalGov: string | null;
  setSelectedLocalGov: (value: string | null) => void;
  localgovernmentstyle?: any;
  containerStyle?: any;
}) => {
  const localGovOptions = selectedState ? (LocalGovernment as any)[selectedState] : [];
  return (
    <View
      style={{
        flexDirection: "column",
        justifyContent: "flex-start",
        width: "100%",
        alignItems: "center",
        paddingVertical: 5,
        ...containerStyle,
      }}
    >
      <View
        style={{
          flex: 1,
          //alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: "400",
            color: "#000000B2",
            lineHeight: 20,
          }}
        >
          State
        </Text>
        <View style={styles.statePicker}>
          <RNPickerSelect
            placeholder={{ label: "Select a State", value: null }}
            onValueChange={(value) => setSelectedState(value)}
            items={NigeriaStates}
          />
        </View>
        {selectedState && (
          <View
            style={{
              width: "100%",
              ...localgovernmentstyle,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "400",
                color: "#000000B2",
                lineHeight: 20,
              }}
            >
              L.G.A
            </Text>
            <View style={styles.statePicker}>
              <RNPickerSelect
                placeholder={{
                  label: "Select a Local Government",
                  value: null,
                }}
                onValueChange={(value) => setSelectedLocalGov(value)}
                items={localGovOptions.map((lg: string) => ({ label: lg, value: lg }))}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default StateLocal;

const styles = StyleSheet.create({
  statePicker: {
    width: 325,
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: COLORS.gray2,
  },
});
