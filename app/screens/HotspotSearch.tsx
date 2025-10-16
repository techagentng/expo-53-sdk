import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import type { ImageSourcePropType } from "react-native";
import { COLORS, icons, SIZES } from "@/constants";
import InsidentType from "../components/InsidentType";
import StateLocal from "../components/StateLocal";
import TextButton from "@/components/TextButton";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";

const HotspotSearch = () => {
  const router = useRouter();
  const [reportType, setReportType] = useState("");
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedLocalGov, setSelectedLocalGov] = useState<string | null>(null);
  const { loading, error, auth_feed } = useSelector((state: any) => state.auth);
  const [filteredData, setFilteredData] = useState([]);

  const report = [
    { label: "Crime", value: "Crime" },
    { label: "Fake Product", value: "Fake Product" },
    { label: "Roads", value: "Roads" },
    { label: "Hospitals", value: "Hospitals" },
    { label: "Accidents", value: "Accidents" },
    { label: "Schools", value: "Schools" },
    { label: "Power", value: "Power" },
    { label: "Portable Water", value: "Portable Water" },
    { label: "Petrol", value: "Petrol" },
    { label: "Airports", value: "Airports" },
    { label: "Transports", value: "Transports" },
    { label: "Embasses", value: "Embasses" },
    { label: "Corruption", value: "Corruption" },
    { label: "Elections", value: "Elections" },
    { label: "Environmnet", value: "Environmnet" },
    { label: "Health Care", value: "Health Care" },
    { label: "Employment", value: "Employment" },
    { label: "Social Welfare", value: "Social Welfare" },
    { label: "Technology", value: "Technology" },
    { label: "Trade & Commerce", value: "Trade & Commerce" },
    { label: "Community Development", value: "Community Development" },
    { label: "Others", value: "Others" },
  ];

  function submitPost() {
    return reportType != "" && selectedState != null;
  }

  useEffect(() => {
    if (auth_feed && auth_feed.length > 0) {
      const filtered = auth_feed.filter(
        (report: any) =>
          report.report_type_name === reportType &&
          report.state_name === selectedState &&
          report.lga_name === selectedLocalGov
      );
      setFilteredData(filtered);
    }
  }, [reportType, selectedState, selectedLocalGov, auth_feed]);

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.goBackButton}
        >
          <Image
            source={(icons.arrowleft || icons.anonymous) as unknown as ImageSourcePropType}
            style={{ width: 20, height: 20, tintColor: "black" }}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.bodyContainer}>
        <Text style={styles.bodyTitleText}>Top Container</Text>
        <Text style={styles.subTitleText}>
          To apply filter select at least one option from the dropdown list.
        </Text>

        <View style={{ paddingHorizontal: 12, gap: 10 }}>
          <InsidentType
            insidenType={reportType}
            setInsidentType={setReportType}
            label="Select the Report Type"
            insident={report}
            containerStyle={{
              width: "100%",
            }}
          />

          <StateLocal
            selectedState={selectedState}
            setSelectedState={setSelectedState}
            selectedLocalGov={selectedLocalGov}
            setSelectedLocalGov={setSelectedLocalGov}
            localgovernmentstyle={{
              marginTop: 20,
              //marginHorizontal: 20,
            }}
            containerStyle={{
              width: 270,
              marginHorizontal: 25,
            }}
          />
        </View>
        <TextButton
          label="Report Filter"
          disabled={submitPost() ? false : true}
          buttonContainerStyle={{
            height: 55,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 200,
            borderRadius: SIZES.radius,
            backgroundColor: submitPost() ? "#0E9C67" : COLORS.invisible,
            marginBottom: 50,
          }}
          labelStyle={{
            color: COLORS.white,
            fontWeight: "700",
            fontSize: 17,
          }}
          onPress={() =>
            router.push({
              pathname: "/screens/SearchScreen",
              params: {
                filteredData: JSON.stringify(filteredData),
                reportType,
                selectedState,
                selectedLocalGov
              }
            })
          }
        />
      </View>
    </View>
  );
};

export default HotspotSearch;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: COLORS.white,
    //paddingVertical: 16,
  },
  goBackButton: {
    paddingHorizontal: 15,
  },
  topContainer: {
    height: 55,
    width: "100%",
    borderBottomWidth: 1.5,
    borderColor: COLORS.gray,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  bodyContainer: {
    padding: 12,
  },
  bodyTitleText: {
    fontWeight: "700",
    fontSize: 18,
    textAlign: "left",
    color: "#000000B2",
  },
  subTitleText: {
    fontWeight: "500",
    fontSize: 15,
    marginVertical: 10,
    color: "#000000B2",
  },
});
