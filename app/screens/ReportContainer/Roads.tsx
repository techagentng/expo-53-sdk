import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  ScrollView,
} from "react-native";
import React, { useEffect, useState, useMemo } from "react";
import ReportWrapper from "./ReportWrapper";
import InsidentType from "../../components/InsidentType";
import TextDesc from "../../components/TextDesc";
import CameraVideoMedia from "../../components/CameraVideoMedia";
import UserLocation from "../../components/UserLocation";
import StateLocal from "../../components/StateLocal";
import CheckBox from "../../components/CheckBox";
import AnonymousPost from "../../components/AnonymousPost";
import TextButton from "../../components/TextButton";
import { COLORS, icons, SIZES } from "@/constants";
import FormInput from "../../components/FormInput";
import RadioGroup from "react-native-radio-buttons-group";
import { useDispatch, useSelector } from "react-redux";
import { createReport } from "@/Redux/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingImage from "../../components/loadingStates/LoadingImage";
import { CREATE_REPORT, MEDIA_UPLOAD } from "@/Redux/URL";
import axios from "axios";
import ErrorImage from "../../components/loadingStates/ErrorImage";
import NetworkError from "../../components/loadingStates/NetworkError";
//import * as ImageManipulator from "expo-image-manipulator";

import * as ImagePicker from "expo-image-picker";
import TextIconButton from "../../components/TextIconButton";
import CustomActivityIndicator from "../../components/CustomActivityIndicator";

import { Video, ResizeMode } from "expo-av";
import * as FileSystem from "expo-file-system";

const Roads = ({ navigation }: any) => {
  const [insidentType, setInsidentType] = useState("");
  const [textInput, setTextInput] = useState("");
  const [albums, setAlbums] = useState<string[]>([]);
  const [storedRecording, setStoredRecording] = useState<string | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>("");
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedLocalGov, setSelectedLocalGov] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [checked, setChecked] = useState(false);
  const [unchecked, setUnChecked] = useState(false);
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [address, setAddress] = useState("");
  const [roadName, setRoadName] = useState("");
  const [videoMedia, setVideoMedia] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState<any>("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [reportTypeID, setReportTypeID] = useState<string | null>("");

  const categ = "Roads";

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

  // async function compressImage(uri) {
  //   try {
  //     const manipulatedImage = await ImageManipulator.manipulateAsync(
  //       uri,
  //       [{ resize: { width: 900 } }], // Resize width to 900px
  //       { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG } // Adjust compression as needed
  //     );
  //     return manipulatedImage.uri;
  //   } catch (error) {
  //     console.log("Error compressing image: ", error);
  //     return uri;
  //   }
  // }

  const mediaAccess = async () => {
    try {
      setImageLoading(true);
      let result = await ImagePicker.launchImageLibraryAsync({
        //allowsEditing: true,
        quality: 1,
        allowsMultipleSelection: true,
      });

      if (!result.canceled) {
        const selectedImages = result.assets.map((asset) => asset.uri);
        setAlbums(selectedImages);
        setImageLoading(false);
        // return selectedImages;
      } else {
        Alert.alert("You did not select any images.");
        setImageLoading(false);
      }
    } catch (error) {
      Alert.alert("Error accessing media library", error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setImageLoading(false);
    }
  };

  const videoAccess = async () => {
    try {
      setImageLoading(true);

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        quality: 1,
        allowsMultipleSelection: true, // Allow multiple video selection
      });

      if (!result.canceled) {
        // Extract selected video URIs
        const selectedVideos = result.assets;

        // Validate minimum and maximum file size
        const validVideos = [];
        for (let video of selectedVideos) {
          const videoInfo = await FileSystem.getInfoAsync(video.uri);

          // Check if file exists and has size property
          if (videoInfo.exists && videoInfo.size) {
            const fileSizeInMB = videoInfo.size / (1024 * 1024); // Convert size to MB

            if (fileSizeInMB <= 100) {
              validVideos.push(video.uri);
            }
          }
        }

        // Check if minimum of 3 valid videos are selected
        if (validVideos.length > 2) {
          Alert.alert(
            "Error",
            "Please select at least 2 videos within 100 MB each."
          );
          setImageLoading(false);
          return;
        }

        setVideoMedia(validVideos);
      } else {
        Alert.alert("You did not select any videos.");
      }
    } catch (error) {
      Alert.alert("Error accessing media library", error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setImageLoading(false);
    }
  };

  const renderImage = ({ item }: { item: string }) => (
    <Image
      source={{ uri: item }}
      style={{
        width: 80,
        height: 80,
        marginRight: 10,
        borderRadius: SIZES.radius,
      }}
    />
  );

  const renderVideoThumbnail = ({ item }: { item: string }) => (
    <View style={styles.videoContainer}>
      <Video
        source={{ uri: item }}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        shouldPlay={false} // Prevent playback
        isMuted={true} // Mute the video
        usePoster // Use the poster as a thumbnail
        posterSource={{ uri: item }} // Use the same video URI as the poster
        isLooping={false} // No looping
      />
    </View>
  );

  async function uploadMediaFile() {
    try {
      setLoading(true);

      const mediaFormData = new FormData();
      mediaFormData.append("report_id", reportTypeID || "");

      if (videoMedia.length > 0) {
        console.log(videoMedia);

        videoMedia.forEach((videoUri, index) => {
          const fileType = videoUri
            .substring(videoUri.lastIndexOf(".") + 1)
            .toLowerCase();
          const allowedVideoTypes = ["mp4", "mov", "avi", "mkv", "webm"];
          if (allowedVideoTypes.includes(fileType)) {
            // For React Native, append file URI as string - server will handle file reading
            mediaFormData.append("mediaFiles", videoUri);
            mediaFormData.append("mediaTypes", `video/${fileType}`);
            mediaFormData.append("mediaNames", `video_${index}.${fileType}`);
          } else {
            console.warn(`Invalid file type: ${fileType}`);
          }
        });
      }

      if (albums) {
        console.log(albums);
        albums.forEach((album, index) => {
          const fileType = album
            .substring(album.lastIndexOf(".") + 1)
            .toLowerCase();
          let mediaType = ["mp4", "mov", "avi", "mkv", "webm"].includes(
            fileType
          )
            ? "video"
            : "image";

          // For React Native, append file URI as string - server will handle file reading
          mediaFormData.append("mediaFiles", album);
          mediaFormData.append("mediaTypes", `${mediaType}/${fileType}`);
          mediaFormData.append("mediaNames", `media_${index}.${fileType}`);
        });
      }
      if (storedRecording) {
        const audioFileType = storedRecording.substring(
          storedRecording.lastIndexOf(".") + 1
        );
        // For React Native, append audio file URI as string - server will handle file reading
        mediaFormData.append("mediaFiles", storedRecording);
        mediaFormData.append("mediaTypes", `audio/${audioFileType}`);
        mediaFormData.append("mediaNames", `recording.${audioFileType}`);
      }
      const mediaResponse = await axios.post(MEDIA_UPLOAD, mediaFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        transformRequest: (data, headers) => {
          return data;
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          console.log(percentCompleted);
        },
      });

      setAlbums([]);
      setReportTypeID(null);
      console.log(mediaResponse.data);
      navigation.navigate("ReportSuccess");

      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.log("server error:", error.response.data);
          setErrorMessage(
            "There was an issue with the server. Please try again later."
          );
        } else if (error.request) {
          console.log("network error:", error.message);
          setErrorMessage(
            "Network error. Please check your internet connection and try again."
          );
        } else {
          console.log("error:", error.message);
          setErrorMessage("An unexpected error occurred. Please try again.");
        }
      } else {
        console.log("Non-axios error:", error);
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function submitReport() {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("category", categ);
      formData.append("sub_report_type", insidentType);
      formData.append("description", textInput);
      formData.append("state_name", selectedState || "");
      formData.append("lga_name", selectedLocalGov || "");
      formData.append("is_anonymous", isEnabled.toString());

      if (address) {
        formData.append("landmark", address);
      }
      if (roadName) {
        formData.append("road_name", roadName);
      }

      if (selectedId) {
        formData.append("rating", selectedId);
      }
      if (location) {
        formData.append("latitude", location.latitude.toString());
        formData.append("longitude", location.longitude.toString());
      }
      console.log(formData);

      const response = await axios.post(CREATE_REPORT, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Report Response:", response.data);

      setReportTypeID(response.data.reportID);
      setLoading(false);
      setModalOpen(true);
      console.log("Report Response:", response.data);
    } catch (error) {
      setLoading(false);
      setError(error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.log("server error:", error.response.data);
          setErrorMessage(
            "There was an issue with the server. Please try again later."
          );
        } else if (error.request) {
          console.log("network error:", error.message);
          setErrorMessage(
            "Network error. Please check your internet connection and try again."
          );
        } else {
          console.log("error:", error.message);
          setErrorMessage("An unexpected error occurred. Please try again.");
        }
      } else {
        console.log("Non-axios error:", error);
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  const roads = [
    { label: "Portholes", value: "Portholes" },
    { label: "Road Constructions", value: "Road Constructions" },
    { label: "Traffic Congestion", value: "Traffic Congestion" },
    { label: "Road Accidents", value: "Road Accidents" },
    {
      label: "Street Lighting",
      value: "Street Lighting",
    },
    {
      label: "Refuse Dumps",
      value: "Refuse Dumps",
    },
    {
      label: "Stagnant gutters",
      value: "Stagnant gutters",
    },
  ];

  function submitPost() {
    return (
      insidentType != "" &&
      textInput != "" &&
      selectedState != null &&
      address != "" &&
      loading === false
    );
  }

  const checkedBoxFucn = (value: boolean) => {
    if (value === checked) {
      setChecked(true);
      setUnChecked(false);
      setCheckboxValue(true);
    } else if (value === unchecked) {
      setUnChecked(true);
      setChecked(false);
      setCheckboxValue(false);
    }
  };

  const radioButtons = useMemo(
    () => [
      {
        id: "1",
        label: "Very Bad",
        value: "Very Bad",
      },
      {
        id: "2",
        label: "Bad",
        value: "Bad",
      },
      {
        id: "3",
        label: "Average",
        value: "Average",
      },
      {
        id: "4",
        label: "Good",
        value: "Good",
      },
      {
        id: "5",
        label: "Very Good",
        value: "Very Good",
      },
    ],
    []
  );

  if (loading) return <LoadingImage />;

  if (error.response) {
    return (
      <View style={styles.errorStyle}>
        <ErrorImage />
        <Text style={{ color: "red", fontSize: 10, fontWeight: "400" }}>
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
              navigation.goBack();
            }}
          />
        </View>
      </View>
    );
  } else if (error.request) {
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
              navigation.goBack();
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
              navigation.goBack();
            }}
          />
        </View>
      </View>
    );
  }
  return (
    <ReportWrapper title="Roads">
      <InsidentType
        insidenType={insidentType}
        setInsidentType={setInsidentType}
        label="Select the type of Incident"
        insident={roads}
      />
      <TextDesc
        onChange={setTextInput}
        value={textInput}
        placeholder="Enter Description"
      />

      <FormInput
        label="Road Name"
        //keyboardType="text"
        onChangeText={(value: string) => {
          setRoadName(value);
        }}
        autoCapitalize="words"
        value={roadName}
        formInputStyle={{
          //height: 40,
          borderWidth: 1,
          borderColor: COLORS.gray2,
          borderRadius: 7,
        }}
      />
      <View style={styles.checkBoxContainer}>
        <Text
          style={{
            fontWeight: "400",
            fontSize: 15,
            lineHeight: 20,
            marginVertical: 10,
            color: "#000000B2",
          }}
        >
          Is this a state road?
        </Text>
        <CheckBox
          checked={checked}
          setChecked={() => checkedBoxFucn(checked)}
          label="Yes"
        />
        <CheckBox
          checked={unchecked}
          setChecked={() => checkedBoxFucn(unchecked)}
          label="No"
        />
      </View>

      <StateLocal
        selectedState={selectedState}
        setSelectedState={setSelectedState}
        selectedLocalGov={selectedLocalGov}
        setSelectedLocalGov={setSelectedLocalGov}
      />
      <FormInput
        label="Landmark"
        //keyboardType="text"
        onChangeText={(value: string) => {
          setAddress(value);
        }}
        autoCapitalize="words"
        value={address}
        formInputStyle={{
          //height: 40,
          borderWidth: 1,
          borderColor: COLORS.gray2,
          borderRadius: 7,
        }}
      />

      <UserLocation location={location} setLocation={setLocation} />
      <View style={styles.checkBoxContainer}>
        <Text
          style={{
            fontWeight: "400",
            fontSize: 15,
            lineHeight: 20,
            marginVertical: 10,
            color: "#000000B2",
          }}
        >
          What is your overall rating of the Road?
        </Text>
        <View style={{ alignItems: "flex-start" }}>
          <RadioGroup
            radioButtons={radioButtons}
            onPress={setSelectedId}
            selectedId={selectedId}
            containerStyle={{
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
            }}
          />
        </View>
      </View>

      <AnonymousPost isEnabled={isEnabled} setIsEnabled={setIsEnabled} />
      <TextButton
        label="Submit Report"
        disabled={submitPost() ? false : true}
        buttonContainerStyle={{
          height: 55,
          alignItems: "center",
          justifyContent: "center",
          marginVertical: SIZES.padding,
          borderRadius: SIZES.radius,
          backgroundColor: submitPost() ? "#0E9C67" : COLORS.gray3,
        }}
        labelStyle={{
          color: COLORS.white,
          fontWeight: "700",
          fontSize: 17,
        }}
        onPress={submitReport}
      />

      <Modal animationType="slide" transparent={true} visible={modalOpen}>
        <ScrollView
          contentContainerStyle={{
            width: "100%",
            //height: "80%",
            flex: 1,
            backgroundColor: COLORS.lightGray2,
            marginTop:
              albums.length || videoMedia.length
                ? SIZES.padding * 6
                : SIZES.padding * 3,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderWidth: 1.5,
            borderColor: COLORS.gray2,
            padding: 15,
          }}
        >
          <TouchableOpacity
            style={{
              marginLeft: "auto",
            }}
            onPress={() => {
              setModalOpen(false);
              navigation.navigate("ReportSuccess");
            }}
          >
            <Image
              source={icons.CancelPNG as any}
              resizeMode="contain"
              style={{
                width: 15,
                height: 15,
              }}
            />
          </TouchableOpacity>
          <View>
            <Text
              style={{
                fontSize: 25,
                fontWeight: "500",
                lineHeight: 30,
                color: COLORS.darkGray,
              }}
            >
              Attach a Media File
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "500",
                lineHeight: 30,
                color: COLORS.darkGray,
              }}
            >
              Click below to attach a media file to the Post
            </Text>
            <TouchableOpacity
              style={{
                borderWidth: 1.5,
                padding: 10,
                borderColor: COLORS.gray,
                borderRadius: 20,
              }}
              disabled={imageLoading}
              onPress={mediaAccess}
            >
              {imageLoading ? (
                <CustomActivityIndicator size={SIZES.ACTIVITY_INDICATOR} color={`${COLORS.primary}`}  />
              ) : (
                <Image
                  source={icons.folderoutline as any}
                  resizeMode="contain"
                  style={{
                    width: albums.length || videoMedia.length ? 90 : 110,
                    height: albums.length || videoMedia.length ? 90 : 110,
                    tintColor: COLORS.darkGray,
                  }}
                />
              )}
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "500",
                  lineHeight: 25,
                  color: COLORS.darkGray,
                  marginLeft: 15,
                }}
              >
                Click to Upload Picture
              </Text>
            </TouchableOpacity>
            <TextIconButton
              disabled={imageLoading}
              containerStyle={{
                height: 50,
                alignItems: "center",
                justifyContent: "center",
                marginTop: SIZES.radius,
                borderRadius: SIZES.radius,
                backgroundColor: "#0585FA",
                width: 200,
              }}
              icon={icons.playcircle}
              iconPosition="LEFT"
              iconStyle={{
                tintColor: "white",
                width: 25,
                resizeMode: "cover",
                height: 25,
              }}
              label="Select a Video"
              labelStyle={{
                marginLeft: SIZES.radius,
                color: "white",
              }}
              onPress={() => videoAccess()}
            />

            {albums.length > 0 && (
              <View style={{ marginTop: 8 }}>
                <FlatList
                  data={albums}
                  renderItem={renderImage}
                  keyExtractor={(item, index) => index.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            )}
            {videoMedia.length > 0 && (
              <View style={styles.galleryContainer}>
                <FlatList
                  data={videoMedia}
                  renderItem={renderVideoThumbnail}
                  keyExtractor={(item, index) => index.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            )}
          </View>
          <TextButton
            label={
              albums.length || videoMedia.length
                ? "Submit Media"
                : "Continue without media"
            }
            // disabled={submitPost() ? false : true}
            buttonContainerStyle={{
              height: 55,
              alignItems: "center",
              justifyContent: "center",
              marginTop:
                albums.length || videoMedia.length
                  ? SIZES.padding * 0.5
                  : SIZES.padding * 5, // Correctly using a ternary operator
              borderRadius: SIZES.radius,
              backgroundColor: COLORS.primary,
            }}
            labelStyle={{
              color: COLORS.white,
              fontWeight: "700",
              fontSize: 17,
            }}
            onPress={() => {
              if (albums.length || videoMedia.length) {
                uploadMediaFile();
              } else {
                setModalOpen(false);
                navigation.navigate("ReportSuccess");
              }
            }}
          />
        </ScrollView>
      </Modal>
    </ReportWrapper>
  );
};

export default Roads;

const styles = StyleSheet.create({
  checkBoxContainer: {
    marginVertical: 20,
  },
  errorStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  galleryContainer: {
    marginTop: 5,
  },
  videoContainer: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  video: {
    width: "100%",
    height: "100%",
  },
});
