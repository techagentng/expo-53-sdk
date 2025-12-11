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
  const [isAppReady, setIsAppReady] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isValidImage, setIsValidImage] = useState(false);
  const [avatarMenuVisible, setAvatarMenuVisible] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, user, availableCoins, access_token: reduxToken } = useSelector(
    (state: RootState) => state.auth
  );

  // Debug Redux state
  useEffect(() => {
    console.log('🔍 Profile Redux state:', {
      hasUser: !!user,
      userKeys: user ? Object.keys(user) : [],
      hasName: user?.name,
      hasFullname: user?.fullname,
      hasUsername: user?.username,
      hasToken: !!access_token,
      loading,
      error,
      errorType: typeof error,
      timestamp: new Date().toISOString()
    });
  }, [user, access_token, loading, error]);

  const handleRefresh = () => {
    const tokenToUse = reduxToken || access_token;
    if (tokenToUse) {
      dispatch(profile_sec({ access_token: tokenToUse }));
      dispatch(rewardCount({ access_token: tokenToUse }));
      Alert.alert("Profile Refreshed", "Your profile details are updated!");
    }
  };

  const userProfile = async () => {
    try {
      const tokenToUse = reduxToken || access_token;
      if (!tokenToUse) return;
      const response = await axios.get(PROFILE, {
        headers: {
          Authorization: `Bearer ${tokenToUse}`,
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
    console.log('🔄 Profile: Loading profile data');
    // Try to load profile data if we have a token, but don't block rendering if we don't
    const tokenToUse = reduxToken || access_token;
    if (tokenToUse) {
      console.log('🔄 Profile: Fetching fresh data with token');
      dispatch(profile_sec({ access_token: tokenToUse }));
      dispatch(rewardCount({ access_token: tokenToUse }));
    }
    // Mark as loaded immediately to prevent blocking the UI
    setHasLoadedOnce(true);
  }, [dispatch, access_token, reduxToken]);

  useFocusEffect(
    React.useCallback(() => {
      const tokenToUse = reduxToken || access_token;
      if (tokenToUse) {
        dispatch(profile_sec({ access_token: tokenToUse }));
        dispatch(rewardCount({ access_token: tokenToUse }));
        userProfile();
      }
    }, [dispatch, access_token, reduxToken])
  );

  function loguserout() {
    dispatch(logout());
    setModalVisible(false);
    router.replace("/screens/Authentication/SignIn");
  }

  function refreshBtn() {
    const tokenToUse = reduxToken || access_token;
    if (tokenToUse) {
      dispatch(profile_sec({ access_token: tokenToUse }));
    }
  }


  // Show loading spinner only if we're still loading and haven't shown any content yet
  if ((!isAppReady || !hasLoadedOnce) && loading) {
    console.log('Profile: Loading initial data...');
    return <LoadingImage />;
  }

  // Show error state only if error exists AND it's not a login error AND we don't have a user
  // Login errors should not block the profile page - user just needs to log in
  const isLoginError = error && (
    typeof error === 'object' && 
    (error.errors === 'invalid email or password' || error.status === 'Unprocessable Entity')
  );
  
  if (error && !isLoginError && !user) {
    console.log('Profile: ERROR STATE - showing error UI', { error, hasUser: !!user, timestamp: new Date().toISOString() });
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
  // Show a welcome message if no user data is available AND no token
  // If we have a token, the user is logged in even if profile data is incomplete
  const hasValidUser = user && (user.name || user.fullname || user.username || user.email || user.id);
  const hasToken = reduxToken || access_token;
  
  if (!hasValidUser && !hasToken) {
    return (
      <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
        <Text style={{ textAlign: 'center', color: COLORS.gray2, marginBottom: 20 }}>
          Welcome! Sign in to access your profile.
        </Text>
        <TextButton
          label="Sign In"
          buttonContainerStyle={{ 
            height: 50, 
            width: 200,
            alignItems: "center", 
            justifyContent: "center", 
            borderRadius: SIZES.radius, 
            backgroundColor: "#0E9C67" 
          }}
          labelStyle={{ color: COLORS.white, fontWeight: "700", fontSize: 18 }}
          onPress={() => router.push("/screens/Authentication/SignIn")}
        />
      </View>
    );
  }

  // Helper function to get user display name
  const getDisplayName = () => {
    return user?.name || user?.fullname || user?.username || user?.email?.split('@')[0] || 'User';
  };

  // Helper function to get username
  const getUsername = () => {
    return user?.username || user?.name || user?.email?.split('@')[0] || '';
  };

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
            <Text style={styles.fullName}>{getDisplayName()}</Text>
            <Text style={styles.userName}>@{getUsername()}</Text>
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
                    color: "black",
                    marginHorizontal: 8,
                  }}
                >
                  {availableCoins?.total_balance || "0"}
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
            onPress={() => router.push("/screens/Settings")}
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
                <Text style={styles.avatarMenuName}>{getDisplayName()}</Text>
                <Text style={styles.avatarMenuUsername}>@{getUsername()}</Text>
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
                router.push("/screens/Settings");
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
