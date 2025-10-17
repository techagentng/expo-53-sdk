import {
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList,
    Image,
  } from "react-native";
import React, { useEffect } from "react";
import { COLORS, icons, SIZES } from "@/constants";
import { feeds as DummyFeedData } from "@/data/DummyFeedData";
import Feed from "../components/Feed";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

// Define navigation types
type RootStackParamList = {
  SignUpMethod: undefined;
  FeedDetail: { feed: any };
  ImageScreen: { images: string[] };
};

type NonAuthFeedNavigationProp = StackNavigationProp<RootStackParamList>;

const SearchScreen = ({ navigation }: { navigation: NonAuthFeedNavigationProp }) => {
    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate("SignUpMethod")}
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
              }}
            >
              Create an account to see more
            </Text>
          </View>
        </View>
        <FlatList
          data={DummyFeedData}
          renderItem={({ item }) => <Feed item={item} />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ ...styles.itemContainer, flexGrow: 1 }}
          ListFooterComponent={<View style={{ height: 105 }} />}
        />
      </View>
    );
  };
  
  export default SearchScreen;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 30,
      backgroundColor: COLORS.white,
      //paddingVertical: 16,
    },
    goBackButton: {
      paddingHorizontal: 15,
    },
    topContainer: {
      height: 46,
      width: "100%",
      borderBottomWidth: 1.5,
      borderColor: COLORS.gray,
      paddingVertical: 10,
    },
    appliedFilterTitleText: {
      fontWeight: "700",
      fontSize: 17,
      lineHeight: 22.4,
    },
    seachText: {
      backgroundColor: COLORS.primary,
      color: COLORS.white,
      padding: 8,
      borderRadius: 30,
      fontWeight: "700",
      fontSize: 13,
    },
    itemContainer: {
      //paddingHorizontal: 20,
      marginTop: 12,
      marginBottom: "auto",
    },
    numberOfSearch: {
      width: "100%",
      height: 36,
      backgroundColor: COLORS.gray3,
      alignItems: "flex-start",
      justifyContent: "center",
      paddingLeft: 15,
    },
    searchText: {
      fontWeight: "600",
      fontSize: 14,
      lineHeight: 19,
    },
  });
  