import { Platform, View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import TextIconButton from "./TextIconButton";
import { COLORS, SIZES, icons } from "@/constants";
import * as Location from "expo-location";

const UserLocation = ({ location, setLocation }: any) => {
  //const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(true);

  async function getLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg(
        "Permission to access location was denied your location is required to make report"
      );
      setPermissionDenied(true);
      return;
    }

    let mylocation = await Location.getCurrentPositionAsync({});
    if (mylocation) {
      setLocation(mylocation);
      setLocation({
        latitude: mylocation.coords.latitude,
        longitude: mylocation.coords.longitude,
      });
      setPermissionDenied(false);
    } else if (errorMsg) {
      console.log(errorMsg);
      setPermissionDenied(true);
    }
  }

  useEffect(() => {
    getLocation();
    let intervalId: number | undefined;
    if (permissionDenied) {
      intervalId = setInterval(() => {
        getLocation();
      }, 3000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [permissionDenied]);

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        height: 40,
        marginVertical: 15,
      }}
    >
      <TextIconButton
        containerStyle={{
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          marginTop: SIZES.radius,
          borderRadius: SIZES.radius,
          backgroundColor: COLORS.lightGray2,
          borderWidth: 1,
          borderColor: COLORS.primary,
          width: 250,
        }}
        icon={icons.location}
        iconPosition="LEFT"
        iconStyle={{
          tintColor: COLORS.primary,
        }}
        label="Use my current location"
        labelStyle={{
          marginLeft: SIZES.radius,
          color: COLORS.primary,
        }}
        onPress={() => getLocation()}
      />
    </View>
  );
};

export default UserLocation;
