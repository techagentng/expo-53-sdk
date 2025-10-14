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
import React, { useEffect, useState } from "react";
import ReportWrapper from "./ReportWrapper";
import InsidentType from "../../components/InsidentType";
import TextDesc from "../../components/TextDesc";
import CameraVideoMedia from "../../components/CameraVideoMedia";
import UserLocation from "../../components/UserLocation";
import DateTime from "../../components/DateTime";
import StateLocal from "../../components/StateLocal";
import CheckBox from "../../components/CheckBox";
import AnonymousPost from "../../components/AnonymousPost";
import { COLORS, icons, SIZES } from "@/constants";
import LoadingImage from "../../components/loadingStates/LoadingImage";
import CustomActivityIndicator from "../../components/CustomActivityIndicator";
import NetworkError from "../../components/loadingStates/NetworkError";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import { Video, ResizeMode } from "expo-av";
import TextButton from "../../components/TextButton";
import { CREATE_REPORT, MEDIA_UPLOAD } from "@/Redux/URL";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import TextIconButton from "../../components/TextIconButton";
import FormInput from "../../components/FormInput";
import ErrorImage from "../../components/loadingStates/ErrorImage";

const FakeProduct = ({ navigation }: any) => {
  const [insidentType, setInsidentType] = useState("");
  const [textInput, setTextInput] = useState("");
  const [albums, setAlbums] = useState<string[]>([]);
  const [storedRecording, setStoredRecording] = useState<string | null>(null);
  const [photoUri, setPhotoUri] = useState("");
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedLocalGov, setSelectedLocalGov] = useState<string | null>(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [address, setAddress] = useState("");
  const [productName, setProductName] = useState("");
  const [videoMedia, setVideoMedia] = useState<string[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [reportTypeID, setReportTypeID] = useState<string | null>("");

  const categ = "Fake products";

  useEffect(() => {
    // Update currentDate when the component mounts
    const now = new Date();
    setCurrentDate(now);
  }, []);

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
      Alert.alert("Error accessing media library", error instanceof Error ? error.message : String(error));
    } finally {
      setImageLoading(false);
    }
  };

  const renderVideoThumbnail = ({ item }: any) => (
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
          const fileSizeInMB = videoInfo.exists ? videoInfo.size / (1024 * 1024) : 0; // Convert size to MB

          if (fileSizeInMB <= 100) {
            validVideos.push(video.uri);
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
      Alert.alert("Error accessing media library", error instanceof Error ? error.message : String(error));
    } finally {
      setImageLoading(false);
    }
  };

  const renderImage = ({ item }: any) => (
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

  async function uploadMediaFile() {
    try {
      setLoading(true);

      const mediaFormData = new FormData();
      mediaFormData.append("report_id", reportTypeID || "");

      if (videoMedia.length > 0) {
        console.log(videoMedia);

        videoMedia.forEach(async (videoUri, index) => {
          const fileType = videoUri
            .substring(videoUri.lastIndexOf(".") + 1)
            .toLowerCase();
          const allowedVideoTypes = ["mp4", "mov", "avi", "mkv", "webm"];
          if (allowedVideoTypes.includes(fileType)) {
            try {
              const fileContent = await FileSystem.readAsStringAsync(videoUri, {
                encoding: 'base64',
              });
              const blob = new Blob([Uint8Array.from(atob(fileContent), c => c.charCodeAt(0))], {
                type: `video/${fileType}`,
              });
              mediaFormData.append("mediaFiles", blob, `video_${index}.${fileType}`);
            } catch (error) {
              console.warn(`Failed to read video file ${videoUri}:`, error);
            }
          } else {
            console.warn(`Invalid file type: ${fileType}`);
          }
        });
      }

      if (albums) {
        console.log(albums);
        albums.forEach(async (album, index) => {
          const fileType = album
            .substring(album.lastIndexOf(".") + 1)
            .toLowerCase();
          let mediaType = ["mp4", "mov", "avi", "mkv", "webm"].includes(
            fileType
          )
            ? "video"
            : "image";

          try {
            const fileContent = await FileSystem.readAsStringAsync(album, {
              encoding: 'base64',
            });
            const blob = new Blob([Uint8Array.from(atob(fileContent), c => c.charCodeAt(0))], {
              type: `${mediaType}/${fileType}`,
            });
            mediaFormData.append("mediaFiles", blob, `media_${index}.${fileType}`);
          } catch (error) {
            console.warn(`Failed to read image file ${album}:`, error);
          }
        });
      }
      if (storedRecording) {
        const audioFileType = storedRecording.substring(
          storedRecording.lastIndexOf(".") + 1
        );
        try {
          const fileContent = await FileSystem.readAsStringAsync(storedRecording, {
            encoding: 'base64',
          });
          const blob = new Blob([Uint8Array.from(atob(fileContent), c => c.charCodeAt(0))], {
            type: `audio/${audioFileType}`,
          });
          mediaFormData.append("mediaFiles", blob, `recording.${audioFileType}`);
        } catch (error) {
          console.warn(`Failed to read audio file ${storedRecording}:`, error);
        }
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
    } catch (error: unknown) {
      setLoading(false);
      setError(error as any);
      if ((error as any).response) {
        console.log("server error:", (error as any).response.data);
        setErrorMessage(
          "There was an issue with the server. Please try again later."
        );
      } else if ((error as any).request) {
        console.log("network error:", (error as any).message);
        setErrorMessage(
          "Network error. Please check your internet connection and try again."
        );
      } else {
        console.log("error:", (error as any).message);
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
      if (selectedState) {
        formData.append("state_name", selectedState);
      }
      if (selectedLocalGov) {
        formData.append("lga_name", selectedLocalGov);
      }
      formData.append("is_anonymous", String(isEnabled));

      if (address) {
        formData.append("landmark", address);
      }
      if (location && location.latitude && location.longitude) {
        formData.append("latitude", String(location.latitude));
        formData.append("longitude", String(location.longitude));
      } else {
        console.log("Location data is missing or incomplete.");
        setErrorMessage("Please enable location services and try again.");
        return;
      }
      if (productName) {
        formData.append("product_name", productName);
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
    } catch (error: unknown) {
      setLoading(false);
      setError(error as any);
      if ((error as any).response) {
        console.log("server error:", (error as any).response.data);
        setErrorMessage(
          "There was an issue with the server. Please try again later."
        );
      } else if ((error as any).request) {
        console.log("network error:", (error as any).message);
        setErrorMessage(
          "Network error. Please check your internet connection and try again."
        );
      } else {
        console.log("error:", (error as any).message);
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  const crime = [
    { label: "Counterfit Electronics", value: "Counterfit Electronics" },
    { label: "Fake Medicines", value: "Fake Medicines" },
    { label: "KnockOff Clothings", value: "KnockOff Clothings" },
    { label: "Counterfit Cosmetics", value: "Counterfit Cosmetics" },
    { label: "Imitation Food Products", value: "Imitation Food Products" },
  ];

  function submitPost() {
    return (
      insidentType != "" &&
      textInput != "" &&
      selectedState != null &&
      productName != "" &&
      loading === false
    );
  }
  if (loading) return <LoadingImage />;

  if (error.response) {
    return (
      <View style={styles.errorStyle}>
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
    <ReportWrapper title="Fake Products">
      <InsidentType
        insidenType={insidentType}
        setInsidentType={setInsidentType}
        label="Select the type of Incident"
        insident={crime}
      />
      <TextDesc
        onChange={setTextInput}
        value={textInput}
        placeholder="Enter Description"
      />

      <StateLocal
        selectedState={selectedState}
        setSelectedState={setSelectedState}
        selectedLocalGov={selectedLocalGov}
        setSelectedLocalGov={setSelectedLocalGov}
      />
      <UserLocation location={location} setLocation={setLocation} />
      <FormInput
        label="Product Name"
        //keyboardType="text"
        onChangeText={(value) => {
          setProductName(value);
        }}
        autoCapitalize="words"
        value={productName}
        formInputStyle={{
          //height: 40,
          borderWidth: 1,
          borderColor: COLORS.gray2,
          borderRadius: 7,
        }}
      />
      <FormInput
        label="Address/Landmark"
        //keyboardType="text"
        onChangeText={(value) => {
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
          {icons.CancelPNG && (
            <Image
              source={icons.CancelPNG}
              resizeMode="contain"
              style={{
                width: 15,
                height: 15,
              }}
            />
          )}
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
              icons.folderoutline && (
                <Image
                  source={icons.folderoutline}
                  resizeMode="contain"
                  style={{
                    width: albums.length || videoMedia.length ? 90 : 110,
                    height: albums.length || videoMedia.length ? 90 : 110,
                    tintColor: COLORS.darkGray,
                  }}
                />
              )
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

export default FakeProduct;

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
