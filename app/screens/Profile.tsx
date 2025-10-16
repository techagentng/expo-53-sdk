import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Image,
  ImageBackground,
  Alert,
  Modal,
} from "react-native";
import type { ImageSourcePropType } from "react-native";
import React, { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { COLORS, icons, SIZES } from "@/constants";
import BottomTabFeed from "../components/BottomTabFeed";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "@/Redux/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingImage from "@/components/loadingStates/LoadingImage";
import { logout, profile_sec, rewardCount } from "@/Redux/authSlice";
import ErrorImage from "@/components/loadingStates/ErrorImage";
import TextButton from "@/components/TextButton";
import { HOST, PROFILE } from "@/Redux/URL";
import axios from "axios";
import { useRouter } from "expo-router";

type RootStackParamList = {
  Profile: undefined;
  Coin: undefined;
  EditProfile: undefined;
  Settings: undefined;
  SignIn: undefined;
};

const Profile = () => {
  const router = useRouter();
  const [access_token, setAccess_token] = useState("");
  const [catchUser, setCatchUser] = useState({});
  const [isAppReady, setIsAppReady] = useState(false); // new state to control initial loading
  const [modalVisible, setModalVisible] = useState(false);
  const [isValidImage, setIsValidImage] = useState(false);
  const [avatarMenuVisible, setAvatarMenuVisible] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, user, availableCoins } = useSelector(
    (state: RootState) => state.auth
  );

  const handleRefresh = () => {
    if (access_token) {
      dispatch(profile_sec({ access_token }));
      dispatch(rewardCount({ access_token }));
      Alert.alert("Profile Refreshed", "Your profile details are updated!");
    }
  };

  const userProfile = async () => {
    try {
      const response = await axios.get(PROFILE, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem("access_token");
        const userDetail = await AsyncStorage.getItem("user_details");
        setAccess_token(value || "");
        setCatchUser(userDetail ? JSON.parse(userDetail) : {});
      } catch (e) {
        console.log(e);
        setCatchUser({});
      } finally {
        setIsAppReady(true); // set ready state once data is fetched
      }
    };
    getData();
  }, []);

  useEffect(() => {
    if (user?.profileImage) {
      Image.prefetch(user.profileImage)
        .then(() => setIsValidImage(true))
        .catch(() => setIsValidImage(false));
    } else {
      setIsValidImage(false);
    }
  }, [user?.profileImage]);

  useEffect(() => {
    if (access_token) {
      dispatch(profile_sec({ access_token }));
      dispatch(rewardCount({ access_token }));
    }
    console.log(availableCoins);
  }, [dispatch, access_token]);

  useFocusEffect(
    React.useCallback(() => {
      if (access_token) {
        dispatch(profile_sec({ access_token }));
        dispatch(rewardCount({ access_token }));
        userProfile();
      }
    }, [dispatch, access_token])
  );

  function loguserout() {
    dispatch(logout());
    setModalVisible(false);
    router.replace("/screens/Authentication/SignIn");
  }

  function refreshBtn() {
    dispatch(profile_sec({ access_token }));
  }

  // Show loading spinner if not ready or loading
  if (!isAppReady || loading) {
    console.log('Profile: loading... isAppReady:', isAppReady, 'loading:', loading);
    return <LoadingImage />;
  }

  // Show error state if error exists
  if (error) {
    console.log('Profile: error', error);
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end", paddingHorizontal: 8, paddingTop: 5 }}>
          <TextButton
            label="log out"
            buttonContainerStyle={{ height: 35, alignItems: "center", justifyContent: "center", marginTop: 20, borderRadius: SIZES.radius, borderWidth: 1, borderColor: COLORS.primary }}
            labelStyle={{ color: COLORS.black, fontWeight: "700", fontSize: 18 }}
            onPress={() => setModalVisible(true)}
          />
        </View>
        <View style={styles.errorStyle}>
          <ErrorImage />
          <Text style={{ color: "red", fontSize: 12, fontWeight: "400", textAlign: "center" }}>
            Failed to load your profile, please check your network connection or click to refresh
          </Text>
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <TextButton
              label="Refresh"
              buttonContainerStyle={{ height: 50, alignItems: "center", justifyContent: "center", marginTop: 20, borderRadius: SIZES.radius, backgroundColor: "#0E9C67" }}
              labelStyle={{ color: COLORS.white, fontWeight: "700", fontSize: 18 }}
              onPress={refreshBtn}
            />
          </View>
        </View>
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.modalContainer}>
            <View style={styles.imagelogoutContainer}>
              <Image source={(icons.logouticon || icons.anonymous) as unknown as ImageSourcePropType} style={{ height: 60, width: 60, tintColor: "black" }} />
            </View>
            <View style={styles.logoutTextContainer}>
              <Text style={styles.primaryText}>Already leaving?</Text>
              <Text style={styles.secondaryText}>Are you sure you want to logout?</Text>
            </View>
            <View style={styles.buttonContainer}>
              <TextButton
                label="Yes, Logout"
                buttonContainerStyle={{ height: 55, alignItems: "center", justifyContent: "center", marginTop: 20, borderRadius: SIZES.radius, backgroundColor: "#0E9C67" }}
                labelStyle={{ color: COLORS.white, fontWeight: "700", fontSize: 18 }}
                onPress={loguserout}
              />
              <TextButton
                label="No, Am staying"
                buttonContainerStyle={{ height: 55, alignItems: "center", justifyContent: "center", borderRadius: SIZES.radius, backgroundColor: COLORS.transparent, borderWidth: 1, marginTop: 15, borderColor: COLORS.gray2 }}
                labelStyle={{ color: COLORS.black, fontWeight: "700", fontSize: 18 }}
                onPress={() => setModalVisible(false)}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
  // Defensive: If user is missing, show fallback UI
  if (!user || !user.name) {
    console.log('Profile: no user data', user);
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: 40, color: COLORS.gray2 }}>
          No user data found. Please log in again or refresh.
        </Text>
        <TextButton
          label="Refresh"
          buttonContainerStyle={{ height: 50, alignItems: "center", justifyContent: "center", marginTop: 20, borderRadius: SIZES.radius, backgroundColor: "#0E9C67" }}
          labelStyle={{ color: COLORS.white, fontWeight: "700", fontSize: 18 }}
          onPress={handleRefresh}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleRefresh}>
        <Image
          source={(icons.refresh_btn || icons.anonymous) as unknown as ImageSourcePropType}
          style={{ width: 32, height: 32, tintColor: COLORS.primary }}
        />
      </TouchableOpacity>
      <View style={{ marginTop: 10 }}>
        <View style={styles.profileContiner}>
          <TouchableOpacity onPress={() => setAvatarMenuVisible(true)}>
            <Image
              source={
                isValidImage ? { uri: user?.profileImage } : (icons.anonymous as unknown as ImageSourcePropType)
              }
              style={styles.profileImag}
            />
          </TouchableOpacity>
          <View style={styles.profileNameContainer}>
            <Text style={styles.fullName}>{user?.name}</Text>
            <Text style={styles.userName}>@{user?.username}</Text>
          </View>

          <TouchableOpacity onPress={() => router.push("/screens/Coin")}>
            <ImageBackground
              source={(icons.coin_bg || icons.anonymous) as unknown as ImageSourcePropType}
              style={styles.coinImage}
              imageStyle={styles.imageStyle}
            >
              <View
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={styles.topCircle}>
                  <View style={styles.innerCircle}>
                    <Image
                      source={(icons.staricon || icons.anonymous) as unknown as ImageSourcePropType}
                      style={{ height: 12, width: 12, tintColor: "#d49013" }}
                    />
                  </View>
                </View>
                <Text
                  style={{
                    fontWeight: "700",
                    fontSize: 14,
                    lineHeight: 20,
                    color: COLORS.white,
                    marginHorizontal: 8,
                  }}
                >
                  {availableCoins?.total_balance}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontWeight: "500",
                    fontSize: 14,
                    //marginHorizontal: 4,
                    color: COLORS.white,
                  }}
                >
                  X
                </Text>
                <Text
                  style={{
                    fontWeight: "500",
                    fontSize: 14,
                    marginHorizontal: 10,
                    color: COLORS.white,
                  }}
                >
                  Points
                </Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginHorizontal: 10,
            marginVertical: 12,
            gap: 5,
          }}
        >
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push("/screens/EditProfile")}
          >
            <Image
              source={(icons.solution1icon || icons.anonymous) as unknown as ImageSourcePropType}
              style={{ height: 35, width: 35, tintColor: `${COLORS.primary}` }}
            />

            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push("/screens/SettingsWrapper")}
          >
            <Image
              source={(icons.setting || icons.anonymous) as unknown as ImageSourcePropType}
              style={{ height: 23, width: 23, tintColor: `${COLORS.primary}` }}
            />

            <Text style={styles.buttonText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
      <BottomTabFeed />

      {/* Avatar Menu Modal */}
      <Modal animationType="fade" transparent={true} visible={avatarMenuVisible}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setAvatarMenuVisible(false)}
        >
          <View style={styles.avatarMenuContainer}>
            <View style={styles.avatarMenuHeader}>
              <Image
                source={
                  isValidImage ? { uri: user?.profileImage } : (icons.anonymous as unknown as ImageSourcePropType)
                }
                style={styles.avatarMenuImage}
              />
              <View style={styles.avatarMenuUserInfo}>
                <Text style={styles.avatarMenuName}>{user?.name}</Text>
                <Text style={styles.avatarMenuUsername}>@{user?.username}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.avatarMenuItem}
              onPress={() => {
                setAvatarMenuVisible(false);
                router.push("/screens/Profile");
              }}
            >
              <Image
                source={(icons.user || icons.anonymous) as unknown as ImageSourcePropType}
                style={styles.avatarMenuIcon}
              />
              <Text style={styles.avatarMenuItemText}>View Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.avatarMenuItem}
              onPress={() => {
                setAvatarMenuVisible(false);
                router.push("/screens/EditProfile");
              }}
            >
              <Image
                source={(icons.solution1icon || icons.anonymous) as unknown as ImageSourcePropType}
                style={styles.avatarMenuIcon}
              />
              <Text style={styles.avatarMenuItemText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.avatarMenuItem}
              onPress={() => {
                setAvatarMenuVisible(false);
                router.push("/screens/SettingsWrapper");
              }}
            >
              <Image
                source={(icons.setting || icons.anonymous) as unknown as ImageSourcePropType}
                style={styles.avatarMenuIcon}
              />
              <Text style={styles.avatarMenuItemText}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.avatarMenuItem, styles.avatarMenuItemLogout]}
              onPress={() => {
                setAvatarMenuVisible(false);
                setModalVisible(true);
              }}
            >
              <Image
                source={(icons.logouticon || icons.anonymous) as unknown as ImageSourcePropType}
                style={[styles.avatarMenuIcon, { tintColor: '#FF3B30' }]}
              />
              <Text style={[styles.avatarMenuItemText, { color: '#FF3B30' }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 18,
    paddingHorizontal: 12,
  },
  profileContiner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileImag: {
    borderRadius: 50,
    width: 80,
    height: 80,
  },
  profileNameContainer: {
    marginHorizontal: 15,
  },
  fullName: {
    fontWeight: "700",
    fontSize: 16,
    lineHeight: 24,
  },
  userName: {
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 20,
  },
  coinImage: {
    width: 112,
    height: 70,
    //borderRadius: 20,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderRadius: 10,
    borderColor: "#F1D020",
  },
  imageStyle: {
    borderRadius: 10,
    borderWidth: 1.5,
  },
  topCircle: {
    alignItems: "center",
    justifyContent: "center",
    //marginTop: 120,
    backgroundColor: "#f5dc20",
    height: 21,
    width: 21,
    borderWidth: 2,
    borderColor: "#f5dc20",
    borderRadius: 300,
  },
  innerCircle: {
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderRadius: 50,
    backgroundColor: "#F1D020", //  #e3b612
    borderColor: "#f0a61d",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 25,
  },
  editButton: {
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    height: 45,
    width: 155,
    borderWidth: 1.5,
    //marginRight: 8,
    borderColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "800",
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.primary,
    marginLeft: 10,
  },
  errorStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 33,
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
    width: 90,
    height: 90,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 60,
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
    fontSize: 15,
    fontWeight: "400",
    lineHeight: 20,
  },
  modalButtonContainer: {
    width: "100%",
    paddingHorizontal: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  avatarMenuContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    minHeight: 300,
  },
  avatarMenuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightOrange,
    marginBottom: 16,
  },
  avatarMenuImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  avatarMenuUserInfo: {
    flex: 1,
  },
  avatarMenuName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 2,
  },
  avatarMenuUsername: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  avatarMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  avatarMenuIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
    tintColor: COLORS.primary,
  },
  avatarMenuItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.black,
  },
  avatarMenuItemLogout: {
    marginTop: 8,
    backgroundColor: '#FFF5F5',
  },
});
