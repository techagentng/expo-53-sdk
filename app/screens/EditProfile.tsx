import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS, icons, SIZES } from "@/constants";
import FormInput from "../components/FormInput";
import * as ImagePicker from "expo-image-picker";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/Redux/store";
import { UPDATE_PROFILE_PICS, UPDATE_PROFILE } from "@/Redux/URL";
import { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ErrorImage from "@/components/loadingStates/ErrorImage";
import TextButton from "@/components/TextButton";
import NetworkError from "@/components/loadingStates/NetworkError";
import LoadingImage from "@/components/loadingStates/LoadingImage";
import axios from "axios";
import { profile_sec } from "@/Redux/authSlice";
import StateLocal from "../components/StateLocal";
import CustomActivityIndicator from "../components/CustomActivityIndicator";
import { router } from "expo-router";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  editProfileText: {
    fontWeight: "700",
    color: COLORS.primary,
    fontSize: 20,
    textAlign: "center",
    flex: 1,
  },
  profileImg: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileImageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  profileImageText: {
    fontWeight: "700",
    fontSize: 16,
    color: COLORS.primary,
    textAlign: "center",
  },
  errorStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },

  modalContainer: {
    width: "98%",
    height: 235,
    backgroundColor: "white",
    alignSelf: "center",
    marginTop: "auto",
    marginBottom: 7,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: COLORS.gray2,
    paddingHorizontal: 8,
  },

  logoutTextContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
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
    textAlign: "center",
    marginVertical: 10,
  },
});

const EditProfile = () => {
  const [state, setState] = useState<string | null>("");
  const [localGov, setLocalGov] = useState<string | null>("");
  const [fullName, setFullName] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [UserName, setUserName] = useState("");
  const [isValidImage, setIsValidImage] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [profileImag, setProfileImag] = useState("");
  const [loading, setLoading] = useState(false);
  //const [successModal, setSuccessModal] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState<{ response?: any; request?: any; message?: string } | null>(null);

  const { user } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  //const profile = feeds[3];

  const mediaAccess = async () => {
    try {
      setImageLoading(true);
      // const { status } = await MediaLibrary.requestPermissionsAsync();
      // if (status !== "granted") {
      //   Alert.alert(
      //     "Sorry, we need media library permissions to access your photos."
      //   );
      //   setImageLoading(false);
      //   return;
      // }

      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setProfileImag(result.assets[0].uri);
        console.log(profileImag);
        //updatePix(profileImag);
        //console.log("The profile image was updated to the server");
      } else {
        Alert.alert("You did not select any image.");
      }
    } catch (error) {
      //console.error("Error accessing media library: ", error);
      Alert.alert("Error accessing media library", error instanceof Error ? error.message : String(error));
    } finally {
      setImageLoading(false); 
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem("access_token");
        setToken(value);
      } catch (e) {
        console.log(e);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    if (profileImag !== "") {
      updatePix();
    }
  }, [profileImag]);

  useEffect(() => {
    // Only fetch profile if we have a token and user data has changed
    if (token && user && (fullName || UserName || state || localGov)) {
      dispatch(profile_sec({ access_token: token }));
    }
  }, [dispatch, token, user, fullName, UserName, state, localGov]);

  async function updateProfile() {
    try {
      setLoading(true);
      const formData = new FormData();

      if (fullName) {
        formData.append("fullname", fullName);
      }
      if (UserName) {
        formData.append("username", UserName);
      }
      if (state) {
        formData.append("state", state);
      }
      if (localGov) {
        formData.append("lga", localGov);
      }
      const response = await axios.put(UPDATE_PROFILE, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("report created successfully:", response.data);
      if (response.status === 200) {
        setLoading(false);
        setUpdateSuccess(true);
      }
      return response.data;
    } catch (error) {
      setLoading(false);
      const errorObj = error as { response?: any; request?: any; message?: string };
      setError(errorObj || null);
      if (error && typeof error === 'object' && 'response' in error) {
        console.log("server error:", (error as any).response?.data);
        setErrorMessage(
          "There was an issue with the server. Please try again later."
        );
      } else if (error && typeof error === 'object' && 'request' in error) {
        console.log("network error:", (error as any).message);
        setErrorMessage(
          "Network error. Please check your internet connection and try again."
        );
      } else {
        console.log("error:", error);
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  }

  async function updatePix() {
    try {
      setImageLoading(true);
      if (profileImag) {
        const formData = new FormData();
        formData.append("profileImage", {
          uri: profileImag,
          type: "image/jpeg",
          name: "profileUpdate.jpg",
        } as any);

        const response = await axios.put(UPDATE_PROFILE_PICS, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Profile image updated successfully:", response.data);
        if (response.status === 200) {
          Alert.alert("Success", "Profile image updated successfully");
          setImageLoading(false);
          if (token) {
            dispatch(profile_sec({ access_token: token }));
          }
          //dispatch(profile_sec());
          setUpdateSuccess(true);
        }
        return response.data;
      }
    } catch (error) {
      setImageLoading(false);
      //setError(error);
      if (error && typeof error === 'object' && 'response' in error) {
        console.log("server error:", (error as any).response?.data);
        Alert.alert(
          "Error updating picture",
          "There was an issue with the server. Please try again later."
        );
      } else if (error && typeof error === 'object' && 'request' in error) {
        console.log("network error:", (error as any).message);
        Alert.alert(
          "Network error updating picture",
          "Please check your internet connection and try again."
        );
      } else {
        console.log("error:", error);
        Alert.alert(
          "Error updating picture",
          "An unexpected error occurred. Please try again."
        );
      }
    }
  }

  useEffect(() => {
    if (user?.profileImage) {
      Image.prefetch(user.profileImage)
        .then(() => setIsValidImage(true))
        .catch(() => setIsValidImage(false));
    } else {
      setIsValidImage(false);
    }
  }, [user?.profileImage]);

  if (loading) return <LoadingImage />;

  if (error && error.response) {
    return (
      <View style={styles.errorStyle}>
        <ErrorImage />
        <Text style={{ color: "red", fontSize: 12, fontWeight: "400" }}>
          {errorMessage}
        </Text>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <TextButton
            label="Go Back"
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
            onPress={() => {
              router.back();
            }}
          />
        </View>
      </View>
    );
  } else if (error && error.request) {
    return (
      <View style={styles.errorStyle}>
        <NetworkError />
        <Text style={{ color: "red", fontSize: 12, fontWeight: "400" }}>
          {errorMessage}
        </Text>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <TextButton
            label="Go Back"
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
            onPress={() => {
              router.back();
            }}
          />
        </View>
      </View>
    );
  } else if (error) {
    return (
      <View style={styles.errorStyle}>
        <ErrorImage />
        <Text style={{ color: "red", fontSize: 12, fontWeight: "400" }}>
          {errorMessage}
        </Text>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <TextButton
            label="Go Back"
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
            onPress={() => {
              router.back();
            }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          {icons.arrowleft ? (
            <Image
              source={icons.arrowleft}
              style={{ width: 20, height: 20, tintColor: "black" }}
            />
          ) : (
            <View
              style={{
                width: 20,
                height: 20,
                backgroundColor: "black",
                borderRadius: 10,
              }}
            />
          )}
        </TouchableOpacity>
        <Text style={styles.editProfileText}>Edit Profile</Text>
      </View>

      <View style={styles.profileImageContainer}>
        <TouchableOpacity onPress={mediaAccess}>
          {imageLoading ? (
            <CustomActivityIndicator size={SIZES.ACTIVITY_INDICATOR} color={`${COLORS.primary}`}  />
          ) : profileImag ? (
            <Image
              source={{ uri: user?.profileImag }}
              style={styles.profileImg}
            />
          ) : (
            <Image
              source={
                isValidImage ? { uri: user?.profileImage } : (
                  icons.anonymous ? icons.anonymous : undefined
                )
              }
              style={styles.profileImg}
            />
          )}
        </TouchableOpacity>
        <Text style={[styles.profileImageText, { marginTop: 15 }]}>Change Profile Photo</Text>
      </View>

      <ScrollView>
        <View>
          <FormInput
            label="Full Name"
            placeholder={user?.name}
            containerStyle={{
              marginTop: SIZES.radius,
              flex: 1,
            }}
            onChangeText={(text: string) => {
              setFullName(text);
            }}
            errorMsg={fullNameError}
            appendComponent={
              <View
                style={{
                  justifyContent: "center",
                }}
              >
                <Image
                  source={
                    (fullName == "" || (fullName != "" && fullNameError == ""))
                      ? (icons.correct || icons.cross || undefined)
                      : (icons.cross || icons.correct || undefined)
                  }
                  style={{
                    height: 20,
                    width: 20,
                    tintColor:
                      fullName == ""
                        ? COLORS.gray
                        : fullName != "" && fullNameError == ""
                        ? COLORS.green
                        : COLORS.red,
                  }}
                />
              </View>
            }
          />

          <View style={{ marginLeft: "auto", height: 30 }}>
            <Text
              style={{ fontWeight: "700", fontSize: 17, color: COLORS.primary }}
            >
              Change Fullname
            </Text>
          </View>
        </View>

        <View>
          <FormInput
            label="Username"
            placeholder={user?.username}
            containerStyle={{
              marginTop: SIZES.radius,
              flex: 1,
            }}
            onChangeText={(value: string) => {
              setUserName(value);
            }}
            errorMsg={fullNameError}
            appendComponent={
              <View
                style={{
                  justifyContent: "center",
                }}
              >
                <Image
                  source={
                    (UserName == "" || (UserName != "" && usernameError == ""))
                      ? (icons.correct || icons.cross || undefined)
                      : (icons.cross || icons.correct || undefined)
                  }
                  style={{
                    height: 20,
                    width: 20,
                    tintColor:
                      UserName == ""
                        ? COLORS.gray
                        : fullName != "" && usernameError == ""
                        ? COLORS.green
                        : COLORS.red,
                  }}
                />
              </View>
            }
          />

          <View style={{ marginLeft: "auto", height: 30 }}>
            <Text
              style={{ fontWeight: "700", fontSize: 15, color: COLORS.primary }}
            >
              Change Username
            </Text>
          </View>
        </View>

        <StateLocal
          selectedState={state}
          setSelectedState={setState}
          selectedLocalGov={localGov}
          setSelectedLocalGov={setLocalGov}
        />
        <TextButton
          label="Update your details"
          //disabled={isEnableSignUp() ? false : true}
          buttonContainerStyle={{
            height: 55,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 45,
            borderRadius: SIZES.radius,
            backgroundColor: "#0E9C67",
          }}
          labelStyle={{
            color: COLORS.white,
            fontWeight: "700",
            fontSize: 17,
          }}
          onPress={updateProfile}
        />
      </ScrollView>
      <Modal animationType="slide" transparent={true} visible={updateSuccess}>
        <View style={styles.modalContainer}>
          <Image
            source={icons.SignUpSuccess || undefined}
            style={{ height: 110, width: 110, marginTop: 5 }}
            resizeMode="contain"
          />

          <View style={styles.logoutTextContainer}>
            <Text style={styles.primaryText}>Profile Updated successfully</Text>
          </View>
          <TextButton
            label="Dismiss"
            buttonContainerStyle={{
              height: 50,
              width: "80%",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 20,
              borderRadius: SIZES.radius,
              backgroundColor: COLORS.primary,
            }}
            labelStyle={{
              color: COLORS.white,
              fontWeight: "700",
              fontSize: 18,
            }}
            onPress={() => {
              setUpdateSuccess(false);
              if (token) {
                dispatch(profile_sec({ access_token: token }));
              }
              router.replace('/(tabs)');
            }}
          />
        </View>
      </Modal>
    </View>
  );
};

export default EditProfile;
