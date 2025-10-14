import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  FlatList,
  RefreshControl,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { COLORS, icons, SIZES } from "@/constants";
import { authFeed } from "@/Redux/authSlice";
import { useDispatch, useSelector } from "react-redux";

import TextButton from "../components/TextButton";
import ErrorImage from "../components/loadingStates/ErrorImage";
import ApiAnonymousFeed from "../components/ApiAnonymousFeed";

interface AnonymousFeedProps {
  navigation: any;
}

const AnonymousFeed = ({ navigation }: AnonymousFeedProps) => {
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const { loading, error, auth_feed } = useSelector((state: any) => state.auth);

  useEffect(() => {
    dispatch(authFeed({ access_token: undefined }) as any);
  }, [dispatch]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(authFeed({ access_token: undefined }) as any);
    if (loading === false) {
      setRefreshing(false);
    }
  }, []);

  function refreshBtn() {
    dispatch(authFeed({ access_token: undefined }) as any);
  }

  if (loading) return <View><Text>Loading...</Text></View>;

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
          Failed to load Feed, please check your network connection or click to
          refresh
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
      <View style={styles.top}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingTop: 15,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.goBackButton}
          >
            <Text style={{ fontSize: 20 }}>←</Text>
          </TouchableOpacity>
          <Text
            style={{
              alignSelf: "center",
              textAlign: "center",
              fontWeight: "600",
              fontSize: 16,
              color: COLORS.primary,
              lineHeight: 25,
            }}
          >
            Create an account to see more
          </Text>
        </View>

        <Text
          style={{
            fontWeight: "700",
            fontSize: 19,
            color: COLORS.primary,
            marginLeft: 15,
            lineHeight: 25,
          }}
        >
          Reports Feed
        </Text>
      </View>

      <FlatList
        data={auth_feed}
        renderItem={({ item }) => <ApiAnonymousFeed item={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ ...styles.itemContainer, flexGrow: 1 }}
        ListFooterComponent={<View style={{ height: 105 }} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

export default AnonymousFeed;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
    backgroundColor: "white",
  },
  top: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray3,
    alignItems: "flex-start",
    justifyContent: "flex-end",
    height: 30,
  },
  goBackButton: {
    paddingHorizontal: 15,
  },
  itemContainer: {
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
