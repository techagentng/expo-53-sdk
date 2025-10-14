import { StyleSheet, Text, View, FlatList, RefreshControl } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
//import feeds from "../data/DummyFeedData";
//import Feed from "./Feed";
import { COLORS, SIZES } from "@/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ErrorImage from "./loadingStates/ErrorImage";
import TextButton from "./TextButton";

import LoadingImage from "./loadingStates/LoadingImage";
import { GET_USER_FEED } from "@/Redux/URL";
import axios from "axios";
import ApiUserFeed from "./ApiUserFeed";
import ApiFeed from "./ApiFeed";

const UserPost = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [userFeed, setUserFeed] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const value = await AsyncStorage.getItem("access_token");
        const response = await axios.get(GET_USER_FEED, {
          headers: {
            Authorization: `Bearer ${value}`,
          },
        });
        // console.log(
        //   "Auth Feeds successfully gotten:",
        //   response.data.incident_reports
        // );
        if (response.status === 200) {
          setUserFeed(response.data.reports);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
        setError(true);

        if (error && typeof error === 'object' && 'response' in error) {
          console.log("server error:", (error as any).response?.data);
          setErrorMessage((error as any).response?.data || "Server error occurred");
        } else if (error && typeof error === 'object' && 'request' in error) {
          console.log("network error:", (error as any).message);
          setErrorMessage((error as any).message || "Network error occurred");
        } else {
          console.log("error:", error);
          setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    const getData = async () => {
      try {
        setLoading(true);
        const value = await AsyncStorage.getItem("access_token");
        const response = await axios.get(GET_USER_FEED, {
          headers: {
            Authorization: `Bearer ${value}`,
          },
        });
        // console.log(
        //   "Auth Feeds successfully gotten:",
        //   response.data.incident_reports
        // );
        if (response.status === 200) {
          setUserFeed(response.data.reports);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
        setError(true);

        if (error && typeof error === 'object' && 'response' in error) {
          console.log("server error:", (error as any).response?.data);
          setErrorMessage((error as any).response?.data || "Server error occurred");
        } else if (error && typeof error === 'object' && 'request' in error) {
          console.log("network error:", (error as any).message);
          setErrorMessage((error as any).message || "Network error occurred");
        } else {
          console.log("error:", error);
          setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };
    getData();
    if (loading === false) {
      setRefreshing(false);
    }
  }, []);

  function refreshBtn() {
    const getData = async () => {
      try {
        setLoading(true);
        const value = await AsyncStorage.getItem("access_token");
        const response = await axios.get(GET_USER_FEED, {
          headers: {
            Authorization: `Bearer ${value}`,
          },
        });
        // console.log(
        //   "Auth Feeds successfully gotten:",
        //   response.data.incident_reports
        // );
        if (response.status === 200) {
          setUserFeed(response.data.reports);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
        setError(true);

        if (error && typeof error === 'object' && 'response' in error) {
          console.log("server error:", (error as any).response?.data);
          setErrorMessage((error as any).response?.data || "Server error occurred");
        } else if (error && typeof error === 'object' && 'request' in error) {
          console.log("network error:", (error as any).message);
          setErrorMessage((error as any).message || "Network error occurred");
        } else {
          console.log("error:", error);
          setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };
    getData();
  }

  if (loading) return <LoadingImage />;
  //console.log("From feed section", auth_feed);

  if (error)
    return (
      <View style={styles.errorStyle}>
        <ErrorImage />
        <Text
          style={{
            color: "red",
            fontSize: 12,
            fontWeight: "400",
            textAlign: "center",
          }}
        >
          {errorMessage}
        </Text>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <TextButton
            label="Refresh"
            buttonContainerStyle={{
              height: 50,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 20,
              borderRadius: SIZES.radius,
              backgroundColor: "#0E9C67",
            }}
            labelStyle={{
              color: COLORS.white,
              fontWeight: "700",
              fontSize: 18,
            }}
            onPress={refreshBtn}
          />
        </View>
      </View>
    );

  return (
    <View style={styles.container}>
      {userFeed.length > 0 && userFeed !== null && (
        <FlatList
          data={userFeed}
          renderItem={({ item }) => <ApiUserFeed item={item} />}
          keyExtractor={(item, index) => (item?.id?.toString() || index.toString())}
          contentContainerStyle={{ ...styles.itemContainer, flexGrow: 1 }}
          ListFooterComponent={<View style={{ height: 105 }} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

export default UserPost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  itemContainer: {
    //paddingHorizontal: 6,
    marginTop: 8,
    marginBottom: "auto",
  },
  errorStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
});
