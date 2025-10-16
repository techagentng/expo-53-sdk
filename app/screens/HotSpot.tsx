import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import type { ImageSourcePropType } from "react-native";
import { COLORS, icons } from "@/constants";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingImage from "../components/loadingStates/LoadingImage";
import { useRouter } from "expo-router";

const HotSpot = () => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [reportCounts, setReportCounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReportCategories = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem("access_token");

        if (!token) {
          Alert.alert("Error", "Access token not found. Please log in.");
          setLoading(false);
          return;
        }

        // Make the API request
        const response = await axios.get(
          "https://citizenx-9hk2.onrender.com/api/v1/top/report/categories",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Set the fetched categories and report counts in state
        setCategories(response.data.categories);
        setReportCounts(response.data.report_counts);
      } catch (err) {
        setError("Failed to load data. Please try again.");
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReportCategories();
  }, []);

  // ReportContainer Component
  const ReportContainer = ({ primaryText, secondaryText }: any) => (
    <TouchableOpacity
      style={styles.reportComponentContainer}
      //onPress={() => navigation.navigate("SearchScreen")}
    >
      <Text style={styles.primTextContainer}>{primaryText}</Text>
      <Text style={styles.secTextContainer}>{secondaryText}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.firstContainer}>
        <Text style={styles.hotSpotText}>Hotspot</Text>
      </View>

      <View style={styles.secondContainer}>
        <TouchableOpacity
          style={styles.seachContainer}
          onPress={() => router.push("/screens/HotspotSearch")}
        >
          <Image
            source={(icons.searchsharp || icons.anonymous) as unknown as ImageSourcePropType}
            style={{ height: 20, width: 20, tintColor: `${COLORS.gray}` }}
          />
          <Text style={styles.filterReportText}>Filter Reports Hotspot</Text>
        </TouchableOpacity>

        <Text style={styles.instructionText}>
          Get access to live report data on location hotspots in your community
          and other places in Nigeria.
        </Text>
        {loading ? (
          <View
            style={{
              marginTop: 110,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LoadingImage />
          </View>
        ) : error ? (
          <Text style={{ color: "red" }}>{error}</Text>
        ) : (
          <ScrollView>
            {categories.map((category, index) => (
              <ReportContainer
                key={index}
                primaryText={category || "Unknown Category"} // Fallback for empty categories
                secondaryText={`${reportCounts[index]} Reports`}
              />
            ))}
          </ScrollView>
        )}
      </View>
    </ScrollView>
  );
};

export default HotSpot;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
    backgroundColor: COLORS.white,
  },
  firstContainer: {
    height: 30,
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    borderBottomWidth: 1.5,
    borderColor: COLORS.gray,
  },
  hotSpotText: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 19,
    lineHeight: 20,
    marginLeft: 15,
  },
  seachContainer: {
    borderWidth: 1.5,
    borderColor: COLORS.gray,
    borderRadius: 25,
    height: 47,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  secondContainer: {
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 120,
  },
  filterReportText: {
    fontWeight: "700",
    fontSize: 16,
    color: COLORS.gray,
    lineHeight: 22,
  },
  reportContainer: {
    borderWidth: 1.5,
    marginTop: 20,
    borderRadius: 10,
    height: 180,
    borderColor: COLORS.gray,
    padding: 12,
  },
  reportedCaseText: {
    fontWeight: "700",
    fontSize: 16,
    color: COLORS.gray,
    marginLeft: 8,
  },
  reportImage: {
    width: 62,
    height: 62,
  },
  reportComponentContainer: {
    //alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
    backgroundColor: "#ECFDF7",
    height: 60,
    padding: 12,
    borderRadius: 10,
    gap: 5,
  },
  instructionText: {
    textAlign: "left",
    color: "#000000B2",
    fontSize: 16,
    fontWeight: "700",
    marginVertical: 8,
  },
  primTextContainer: {
    fontWeight: "700",
    fontSize: 13,
    lineHeight: 19.6,
  },
  secTextContainer: {
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 19.6,
  },
});
