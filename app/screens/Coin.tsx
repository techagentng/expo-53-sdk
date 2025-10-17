import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import type { ImageSourcePropType } from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS, icons, SIZES } from "@/constants";
import PointInvite from "../components/PointInvite";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingImage from "@/components/loadingStates/LoadingImage";
import { rewardCount } from "@/Redux/authSlice";
import ErrorImage from "@/components/loadingStates/ErrorImage";
import axios from "axios";
import { USER_REWARD } from "@/Redux/URL";
import TextButton from "@/components/TextButton";

const Coin = ({ navigation }: any) => {
  const [access_token, setAccess_token] = useState("");
  const [isAppReady, setIsAppReady] = useState(false); // new state to control initial loading

  const dispatch = useDispatch<any>();
  const { loading, error, availableCoins } = useSelector((state: any) => state.auth);

  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem("access_token");
        if (value) {
          setAccess_token(value);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setIsAppReady(true); // Ensure app is marked as ready after token retrieval
      }
    };
    getData();
  }, []);

  useEffect(() => {
    if (access_token) {
      dispatch(rewardCount({ access_token }));
    }
  }, [access_token, dispatch]);

  function refreshBtn() {
    dispatch(rewardCount({ access_token }));
  }

  if (!isAppReady || loading) return <LoadingImage />;

  if (error)
    return (
      <View style={styles.errorStyle}>
        <ErrorImage />
        <Text style={{ color: "red", fontSize: 12, fontWeight: "400" }}>
          Failed to load your profile, please check your network connection or
          click to refresh
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

  console.log("reward coins:", availableCoins);
  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={(icons.arrowleft || icons.anonymous) as unknown as ImageSourcePropType}
            style={{ width: 20, height: 20, tintColor: "black" }}
          />
        </TouchableOpacity>

        <Text style={styles.pointText}>X points & Rewards</Text>
      </View>

      <ImageBackground
        source={(icons.coin_bg || icons.anonymous) as unknown as ImageSourcePropType}
        style={styles.coinImage}
        imageStyle={styles.imageStyle}
      >
        <View style={styles.topCircle}>
          <View style={styles.innerCircle}>
            <Image
              source={(icons.staricon || icons.anonymous) as unknown as ImageSourcePropType}
              style={{ width: 53, height: 53, tintColor: "#d49013" }}
            />
          </View>
        </View>
        <View style={{ marginLeft: 30 }}>
          <Text style={styles.pointNumber}>
            {availableCoins?.total_balance || "0"}
          </Text>
          <Text style={styles.pointX}>X Point</Text>
        </View>
      </ImageBackground>
      <PointInvite />
    </View>
  );
};

export default Coin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    marginTop: 12,
    paddingHorizontal: 12,
    backgroundColor: COLORS.white,
  },
  topContainer: {
    flexDirection: "row",
    paddingVertical: 9,
    alignItems: "center",
  },
  pointText: {
    fontWeight: "700",
    fontSize: 19,
    lineHeight: 28,
    marginLeft: 50,
    color: COLORS.primary,
  },
  coinImage: {
    width: 335,
    height: 150,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingLeft: 25,
    alignItems: "center",
    marginBottom: 20,
  },
  imageStyle: {
    borderRadius: 10,
  },
  topCircle: {
    alignItems: "center",
    justifyContent: "center",
    //marginTop: 10,
    backgroundColor: "#f5dc20",
    height: 76,
    width: 76,
    borderWidth: 2,
    borderColor: "#f5dc20",
    borderRadius: 300,
  },
  innerCircle: {
    width: 65,
    height: 65,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderRadius: 50,
    backgroundColor: "#F1D020", //  #e3b612
    borderColor: "#f0a61d",
  },
  pointNumber: {
    fontWeight: "700",
    fontSize: 35,
    color: COLORS.white,
  },
  pointX: {
    fontWeight: "700",
    fontSize: 20,
    color: COLORS.white,
  },
  errorStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
});
