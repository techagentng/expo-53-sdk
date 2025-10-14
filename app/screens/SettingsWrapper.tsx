import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { COLORS, icons } from "@/constants";

const SettingsWrapper = ({ title, containerStyle, children }: any) => {
  const navigation = useNavigation();

  return (
    <View style={{ ...styles.container, ...containerStyle }}>
      <View style={styles.titleContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          {icons.arrowleft ? (
            <Image
              source={icons.arrowleft}
              style={{ width: 20, height: 20, tintColor: "black" }}
            />
          ) : (
            <View
              style={{
                width: 20,
                height: 20,
                backgroundColor: "black",
                borderRadius: 10,
              }}
            />
          )}
        </TouchableOpacity>
        <Text style={styles.titleText}>{title}</Text>
      </View>
      <ScrollView>{children}</ScrollView>
    </View>
  );
};

export default SettingsWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: StatusBar.currentHeight || 45,
    paddingHorizontal: 10,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 15,
  },
  titleText: {
    marginLeft: 35,
    fontWeight: "700",
    fontSize: 20,
    color: COLORS.primary,
  },
});
