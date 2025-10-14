import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import type { ImageSourcePropType } from "react-native";
import Container from "./ReportContainer/Container";
import { COLORS, SIZES, icons } from "@/constants";
import reportData from "@/data/report";
import TextIconButton from "@/components/TextIconButton";
import TextButton from "@/components/TextButton";

const Report = ({ navigation }: any) => {
  const [errorModal, setErrorModal] = useState(false);

  useEffect(() => {
    setErrorModal(true);
  }, []);

  const footerButton = () => {
    return (
      <TextIconButton
        containerStyle={{
          height: 50,
          alignItems: "center",
          justifyContent: "flex-end",

          //marginTop: SIZES.radius,
          borderRadius: SIZES.radius,
          backgroundColor: undefined,
          marginTop: SIZES.padding,
          marginBottom: SIZES.padding,
        }}
        icon={(icons.arrow_right || icons.anonymous) as unknown as ImageSourcePropType}
        iconPosition="RIGHT"
        iconStyle={{
          tintColor: undefined,
        }}
        label="View Report Guidelines"
        labelStyle={{
          marginRight: SIZES.radius,
          fontWeight: "700",
          color: "#0276FF",
        }}
        onPress={() => navigation.navigate("GuideLine")}
      />
    );
  };

  const HeadeComponent = () => (
    <View style={styles.textContainer}>
      <Text style={styles.title}>Make a report</Text>
      <Text style={styles.subTitle}>
        Please select the category of report you want to make
      </Text>
    </View>
  );
  return (
    <View style={styles.primaryContainer}>
      <View>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.imageContainer}
        >
          <Image
            source={(icons.arrowleft || icons.anonymous) as unknown as ImageSourcePropType}
            style={{ width: 20, height: 20, tintColor: "black" }}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        ListHeaderComponent={HeadeComponent}
        data={reportData}
        renderItem={({ item }) => <Container item={item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ ...styles.itemContainer, flexGrow: 1 }}
        ListFooterComponent={footerButton}
      />
    </View>
  );
};

export default Report;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
    marginTop: 25,
    paddingHorizontal: 18,
    marginVertical: 15,
    borderWidth: 1,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 25,
    borderColor: COLORS.gray2,
  },
  imageContainer: {
    width: 40,
    height: 40,
    marginTop: 15,
  },
  image: {
    flex: 1,
    width: 30,
    height: 25,
  },
  textContainer: {
    flexDirection: "column",
    marginTop: 5,
    justifyContent: "flex-end",
  },
  title: {
    color: `${COLORS.primary}`,
    fontWeight: "700",
    fontSize: 19,
    lineHeight: 28,
  },
  subTitle: {
    color: "#000000",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 19.6,
  },
  itemContainer: {
    width: 327,
    marginTop: 2,
    alignSelf: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "98%",
    height: 350,
    backgroundColor: "white",
    alignSelf: "center",
    marginTop: "auto",
    marginBottom: 7,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: COLORS.gray2,
  },
  imagelogoutContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  logoutTextContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  primaryText: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 25,
  },
  secondaryText: {
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 20,
    textAlign: "center",
  },
});
