import { StyleSheet, Text, View, FlatList, Image } from "react-native";
import React from "react";
import { COLORS, icons } from "@/constants";
import type { ImageSourcePropType } from "react-native";

const SavedDraft = () => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Image
        source={(icons.workInProgress || icons.anonymous) as unknown as ImageSourcePropType}
        style={{ height: 160, width: 210, marginTop: 8 }}
      />
      <Text style={{ fontSize: 20, fontWeight: "600" }}>Work in progress</Text>
      <Text>Will be available in the next version</Text>
    </View>
  );
};

export default SavedDraft;

const styles = StyleSheet.create({
  itemContainer: {
    //paddingHorizontal: 20,
    paddingTop: 5,
    marginBottom: "auto",
    backgroundColor: COLORS.white,
  },
});
