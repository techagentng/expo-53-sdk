import { COLORS, icons, SIZES } from "@/constants";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
  
  import { ErrorImage } from "@/components/loadingStates/ErrorImage";
import { VIEW_BOOKMARKS } from "@/Redux/URL";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import ApiFeed from "./ApiFeed";
import LoadingImage from "./loadingStates/LoadingImage";
import TextButton from "./TextButton";
  
  const BookMark = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [userBookMark, setUserBookMark] = useState<Array<{id: string | number}>>([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
  
    const getData = async () => {
      try {
        setLoading(true);
        const value = await AsyncStorage.getItem("access_token");
        const response = await axios.get(VIEW_BOOKMARKS, {
          headers: {
            Authorization: `Bearer ${value}`,
          },
        });
        //   "Auth Feeds successfully gotten:",
        //   response.data.incident_reports
        // );
        console.log(response);
        setUserBookMark(response.data.bookmarked_reports);
        setLoading(false);
        setError(false);
        setErrorMessage("");
      } catch (error) {
        console.log(error);
        setLoading(false);
        setError(true);

        if (axios.isAxiosError(error) && error.response) {
          console.log("server error:", error.response.data);
          setErrorMessage(
            "There was an issue with the server. Please try again later."
          );
        } else if (axios.isAxiosError(error) && error.request) {
          console.log("network error:", error.message);
          setErrorMessage(
            "Network error. Please check your internet connection and try again."
          );
        } else {
          const errorMessage = error instanceof Error ? error.message : "Unknown error";
          console.log("error:", errorMessage);
          setErrorMessage("An unexpected error occurred. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      getData();
    }, []);
    const onRefresh = useCallback(() => {
      setRefreshing(true);
      const getData = async () => {
        try {
          setLoading(true);
          const value = await AsyncStorage.getItem("access_token");
          const response = await axios.get(VIEW_BOOKMARKS, {
            headers: {
              Authorization: `Bearer ${value}`,
            },
          });
          // console.log(
          //   "Auth Feeds successfully gotten:",
          //   response.data.incident_reports
          // );
          if (response.status === 200) {
            setUserBookMark(response.data.bookmarked_reports);
            setLoading(false);
          }
        } catch (error) {
          console.log(error);
          setLoading(false);
          setError(true);

          if (axios.isAxiosError(error) && error.response) {
            console.log("server error:", error.response.data);
            setErrorMessage(
              "There was an issue with the server. Please try again later."
            );
          } else if (axios.isAxiosError(error) && error.request) {
            console.log("network error:", error.message);
            setErrorMessage(
              "Network error. Please check your internet connection and try again."
            );
          } else {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            console.log("error:", errorMessage);
            setErrorMessage("An unexpected error occurred. Please try again.");
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
          const response = await axios.get(VIEW_BOOKMARKS, {
            headers: {
              Authorization: `Bearer ${value}`,
            },
          });
          // console.log(
          //   "Auth Feeds successfully gotten:",
          //   response.data.incident_reports
          // );
          if (response.status === 200) {
            setUserBookMark(response.data.bookmarked_reports);
            setLoading(false);
          }
        } catch (error) {
          console.log(error);
          setLoading(false);
          setError(true);

          if (axios.isAxiosError(error) && error.response) {
            console.log("server error:", error.response.data);
            setErrorMessage(
              "There was an issue with the server. Please try again later."
            );
          } else if (axios.isAxiosError(error) && error.request) {
            console.log("network error:", error.message);
            setErrorMessage(
              "Network error. Please check your internet connection and try again."
            );
          } else {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            console.log("error:", errorMessage);
            setErrorMessage("An unexpected error occurred. Please try again.");
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
        {userBookMark.length > 0 || userBookMark !== null ? (
          <>
            <FlatList
              data={userBookMark}
              renderItem={({ item }) => <ApiFeed item={item} />}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{ ...styles.itemContainer, flexGrow: 1 }}
              ListFooterComponent={<View style={{ height: 105 }} />}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          </>
        ) : (
          <View style={{ alignItems: "center", paddingTop: 70, flex: 1 }}>
            <Image
              source={require("@/assets/images/citizenx.png")}
              resizeMode="cover"
              style={{ width: 80, height: 80, tintColor: COLORS.primary }}
            />
            <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 10 }}>
              Your Bookmark is empty
            </Text>
          </View>
        )}
      </View>
    );
  };
  
  export default BookMark;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 10,
      backgroundColor: COLORS.white,
    },
    top: {
      borderBottomWidth: 1,
      borderBottomColor: COLORS.gray3,
      alignItems: "flex-start",
      justifyContent: "flex-end",
      height: 30,
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
  