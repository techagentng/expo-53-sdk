import { COLORS, icons } from "@/constants";
import { Camera, CameraView } from "expo-camera";
import {
  getAlbumsAsync,
  getAssetsAsync,
  saveToLibraryAsync
} from "expo-media-library";
import { shareAsync } from "expo-sharing";
import { SymbolView } from "expo-symbols";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useRef, useState } from "react";
import type { ImageSourcePropType } from "react-native";
import {
  Alert, FlatList, Image, PermissionsAndroid, SafeAreaView, ScrollView, StyleSheet,
  Text,
  TouchableOpacity, View
} from "react-native";

//import {  VideoView } from "expo-video";

function IconButton({ iosName, androidName }: { iosName: string; androidName?: string }) {
  const CONTAINER_PADDING = 5;
  const CONTAINER_WIDTH = 34;
  const ICON_SIZE = 25;

  return (
    <TouchableOpacity
      style={[
        {
          backgroundColor: "#00000050",
          padding: CONTAINER_PADDING,
          borderRadius: (CONTAINER_WIDTH + CONTAINER_PADDING * 2) / 2,
          width: CONTAINER_WIDTH,
        },
      ]}
    >
      <SymbolView
        name={iosName as any}
        size={ICON_SIZE}
        tintColor={"white"}
      />
    </TouchableOpacity>
  );
}

function MainRowActions({ cameraMode, handleTakePicture, isRecording }: {
  cameraMode: string;
  handleTakePicture: () => void;
  isRecording: boolean;
}) {
  const [assets, setAssets] = useState<any[]>([]);

  async function getAlbums() {
    const fetchAlnums = await getAlbumsAsync();
    const albumAssets = await getAssetsAsync({
      mediaType: "photo",
      sortBy: "creationTime",
      first: 6,
    });

    setAssets(albumAssets.assets);
  }

  useEffect(() => {
    getAlbums();
  }, []);

  return (
    <View style={styles.mainRowContainer}>
      <FlatList
        data={assets}
        inverted
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Image
            key={item.id}
            source={item.uri}
            style={{
              width: 40,
              height: 40,
              borderRadius: 5,
            }}
          />
        )}
        horizontal
        contentContainerStyle={{ gap: 6 }}
      />
      <TouchableOpacity onPress={handleTakePicture}>
        <SymbolView
          name={
            cameraMode === "picture"
              ? "circle"
              : isRecording
              ? "record.circle"
              : "circle.circle"
          }
          size={90}
          type="hierarchical"
          tintColor={isRecording ? COLORS.primary : "white"}
          animationSpec={{
            effect: {
              type: isRecording ? "pulse" : "bounce",
            },
            repeating: isRecording,
          }}
          fallback={
            cameraMode === "picture" ? (
              <Image
                source={(icons.dotcircle || icons.anonymous) as unknown as ImageSourcePropType}
                style={{ height: 100, width: 100, tintColor: "white" }}
              />
            ) : isRecording ? (
              <Image
                source={(icons.circlestop || icons.anonymous) as unknown as ImageSourcePropType}
                style={{ height: 100, width: 100, tintColor: "white" }}
              />
            ) : (
              <Image
                source={(icons.playcircle || icons.anonymous) as unknown as ImageSourcePropType}
                style={{ width: 90, height: 90, tintColor: "white" }}
              />
            )
          }
        />
      </TouchableOpacity>
      <ScrollView
        horizontal
        contentContainerStyle={{ gap: 2 }}
        showsHorizontalScrollIndicator={false}
      >
        {[0, 1, 2, 3].map((item) => (
          <Image
            source={(icons.tagfaces || icons.anonymous) as unknown as ImageSourcePropType}
            style={{ width: 50, height: 50, tintColor: "white" }}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function QRCodeButton({ handleOpenQRCode }: { handleOpenQRCode: () => void }) {
  return (
    <TouchableOpacity
      onPress={handleOpenQRCode}
      style={{
        width: 200,
        alignItems: "center",
        top: "65%",
        alignSelf: "center",
        padding: 6,
        borderWidth: 3,
        borderRadius: 10,
        borderStyle: "dashed",
        borderColor: "white",
      }}
    >
      <IconButton iosName="qrcode" androidName="qr-code" />
      <Text style={{ color: "white" }}>QR Code Detected</Text>
    </TouchableOpacity>
  );
}

function CameraTools({
  cameraZoom,
  cameraFlash,
  cameraTorch,
  setCameraZoom,
  setCameraFacing,
  setCameraTorch,
  setCameraFlash,
}: {
  cameraZoom: number;
  cameraFlash: string;
  cameraTorch: boolean;
  setCameraZoom: (value: number | ((prev: number) => number)) => void;
  setCameraFacing: (value: string | ((prev: string) => string)) => void;
  setCameraTorch: (value: boolean | ((prev: boolean) => boolean)) => void;
  setCameraFlash: (value: string | ((prev: string) => string)) => void;
}) {
  const CONTAINER_PADDING = 5;
  const CONTAINER_WIDTH = 34;
  const ICON_SIZE = 25;

  return (
    <View
      style={{
        position: "absolute",
        right: 6,
        gap: 16,
        zIndex: 1,
      }}
    >
      <TouchableOpacity
        onPress={() => setCameraTorch((prev) => !prev)}
        style={[
          {
            backgroundColor: "#00000050",
            padding: CONTAINER_PADDING,
            borderRadius: (CONTAINER_WIDTH + CONTAINER_PADDING * 2) / 2,
            width: CONTAINER_WIDTH,
            marginTop: 35,
            marginRight: 10,
          },
        ]}
      >
        <Image
          source={(icons.flashicon || icons.anonymous) as unknown as ImageSourcePropType}
          style={{ width: ICON_SIZE, height: ICON_SIZE, tintColor: "white" }}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          setCameraFacing((prevValue) =>
            prevValue === "back" ? "front" : "back"
          )
        }
        style={[
          {
            backgroundColor: "#00000050",
            padding: CONTAINER_PADDING,
            borderRadius: (CONTAINER_WIDTH + CONTAINER_PADDING * 2) / 2,
            width: CONTAINER_WIDTH,
            marginTop: 10,
            marginRight: 10,
          },
        ]}
      >
        <Image
          source={(icons.camerareverseicon || icons.anonymous) as unknown as ImageSourcePropType}
          style={{ width: ICON_SIZE, height: ICON_SIZE, tintColor: "white" }}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          setCameraFlash((prevValue) => (prevValue === "off" ? "on" : "off"))
        }
        style={[
          {
            backgroundColor: "#00000050",
            padding: CONTAINER_PADDING,
            borderRadius: (CONTAINER_WIDTH + CONTAINER_PADDING * 2) / 2,
            width: CONTAINER_WIDTH,
            marginTop: 10,
            marginRight: 10,
          },
        ]}
      >
        <Image
          source={(icons.flashlightoutline || icons.anonymous) as unknown as ImageSourcePropType}
          style={{ height: ICON_SIZE, width: ICON_SIZE, tintColor: "white" }}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          if (cameraZoom < 1) {
            setCameraZoom((prevValue) => prevValue + 0.01);
          }
        }}
        style={[
          {
            backgroundColor: "#00000050",
            padding: CONTAINER_PADDING,
            borderRadius: (CONTAINER_WIDTH + CONTAINER_PADDING * 2) / 2,
            width: CONTAINER_WIDTH,
            marginTop: 10,
            marginRight: 10,
          },
        ]}
      >
        <Image
          source={(icons.addcircleoutline || icons.anonymous) as unknown as ImageSourcePropType}
          style={{ width: ICON_SIZE, height: ICON_SIZE, tintColor: "white" }}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          if (cameraZoom > 0) {
            setCameraZoom((prevValue) => prevValue - 0.01);
          }
        }}
        style={[
          {
            backgroundColor: "#00000050",
            padding: CONTAINER_PADDING,
            borderRadius: (CONTAINER_WIDTH + CONTAINER_PADDING * 2) / 2,
            width: CONTAINER_WIDTH,
            marginTop: 10,
            marginRight: 6,
          },
        ]}
      >
        <Image
          source={(icons.minuscircleo || icons.anonymous) as unknown as ImageSourcePropType}
          style={{ width: 30, height: 30, tintColor: "white" }}
        />
      </TouchableOpacity>
    </View>
  );
}
const CameraScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const { setPhotoUri, videoMedia, setVideoMedia } = route.params;
  const [cameraPermissions, setCameraPermissions] = useState<boolean | null>(null);
  const [microphonePermission, setMicrophonePermission] = useState<boolean | null>(null);
  const [mediaLibraryPermission, setMediaLibraryPermission] = useState<boolean | null>(null);

  useEffect(() => {
    // Request camera permissions
    const requestCamera = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera access to take photos',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        setCameraPermissions(granted === PermissionsAndroid.RESULTS.GRANTED);
      } catch (err) {
        console.warn(err);
      }
    };

    // Request microphone permissions
    const requestMicrophone = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'App needs microphone access to record audio',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        setMicrophonePermission(granted === PermissionsAndroid.RESULTS.GRANTED);
      } catch (err) {
        console.warn(err);
      }
    };

    // Request media library permissions
    const requestMediaLibrary = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Media Library Permission',
            message: 'App needs access to your media library',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        setMediaLibraryPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
      } catch (err) {
        console.warn(err);
      }
    };

    requestCamera();
    requestMicrophone();
    requestMediaLibrary();
  }, []);
  const cameraRef = useRef<any>(null);
  const [cameraMode, setCameraMode] = useState("picture");
  const [qrCodeDetected, setQrCodeDetected] = useState("");
  const [isBrowsing, setIsBrowsing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | number | null>(null);
  const [cameraZoom, setCameraZoom] = useState(0);
  const [cameraTorch, setCameraTorch] = useState(false);
  const [cameraFlash, setCameraFlash] = useState("off");
  const [cameraFacing, setCameraFacing] = useState("back");
  const [picture, setPicture] = useState<string>("");
  const [video, setVideo] = useState<string>("");
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    const initCamera = async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          setCameraError('Camera permission is required');
          return;
        }
      } catch (error) {
        setCameraError('Error initializing camera');
        console.error('Camera initialization error:', error);
      }
    };

    initCamera();
  }, []);

  function PictureView({ picture, setPicture }: { picture: string; setPicture: (value: string) => void }) {
    const CONTAINER_PADDING = 5;
    const CONTAINER_WIDTH = 34;
    const ICON_SIZE = 25;
    return (
      <View>
        <View
          style={{
            position: "absolute",
            right: 6,
            zIndex: 1,
            paddingTop: 50,
            gap: 16,
          }}
        >
          <TouchableOpacity
            onPress={async () => {
              await saveToLibraryAsync(picture);
              Alert.alert("Picture saved to phone Library");
              navigation.goBack();
            }}
            style={[
              {
                backgroundColor: "#00000050",
                padding: CONTAINER_PADDING,
                borderRadius: (CONTAINER_WIDTH + CONTAINER_PADDING * 2) / 2,
                width: CONTAINER_WIDTH,
                marginTop: 10,
                marginRight: 10,
              },
            ]}
          >
            <Image
              source={(icons.saveoutline || icons.anonymous) as unknown as ImageSourcePropType}
              style={{
                width: ICON_SIZE,
                height: ICON_SIZE,
                tintColor: "white",
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setPicture("")}
            style={[
              {
                backgroundColor: "#00000050",
                padding: CONTAINER_PADDING,
                borderRadius: (CONTAINER_WIDTH + CONTAINER_PADDING * 2) / 2,
                width: CONTAINER_WIDTH,
                marginTop: 10,
                marginRight: 10,
              },
            ]}
          >
            <Image
              source={(icons.deleteIcon || icons.anonymous) as unknown as ImageSourcePropType}
              style={{
                width: ICON_SIZE,
                height: ICON_SIZE,
                tintColor: "white",
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={async () => await shareAsync(picture)}
            style={[
              {
                backgroundColor: "#00000050",
                padding: CONTAINER_PADDING,
                borderRadius: (CONTAINER_WIDTH + CONTAINER_PADDING * 2) / 2,
                width: CONTAINER_WIDTH,
                marginTop: 10,
                marginRight: 10,
              },
            ]}
          >
            <Image
              source={(icons.sharesocialoutline || icons.anonymous) as unknown as ImageSourcePropType}
              style={{
                width: ICON_SIZE,
                height: ICON_SIZE,
                tintColor: "white",
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            position: "absolute",
            zIndex: 1,
            paddingTop: 50,
            left: 6,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setPicture("");
              navigation.goBack();
            }}
            style={[
              {
                backgroundColor: "#00000050",
                padding: CONTAINER_PADDING,
                borderRadius: (CONTAINER_WIDTH + CONTAINER_PADDING * 2) / 2,
                width: CONTAINER_WIDTH,
                marginTop: 10,
                marginRight: 10,
              },
            ]}
          >
            <Image
              source={(icons.closecircleoutline || icons.anonymous) as unknown as ImageSourcePropType}
              style={{
                width: ICON_SIZE,
                height: ICON_SIZE,
                tintColor: "white",
              }}
            />
          </TouchableOpacity>
        </View>
        <Image
          source={{ uri: picture }}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </View>
    );
  }

  async function toggleRecord() {
    if (isRecording) {
      cameraRef.current?.stopRecording();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      const response = await cameraRef.current?.recordAsync();
      setVideoMedia(response?.uri);
      setVideo(response?.uri);
    }
  }
  async function handleTakePicture() {
    const response = await cameraRef.current?.takePictureAsync({});
    setPicture(response?.uri);
    setPhotoUri(response?.uri);
  }

  function BottomRowTools({ setCameraMode, cameraMode }: { setCameraMode: (value: string) => void; cameraMode: string }) {
    const CONTAINER_PADDING = 5;
    const CONTAINER_WIDTH = 34;
    const ICON_SIZE = 25;
    return (
      <View style={[styles.bottomContainer, styles.directionRowItemsCenter]}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Medialibrary")}
          style={[
            {
              backgroundColor: "#00000050",
              padding: CONTAINER_PADDING,
              borderRadius: (CONTAINER_WIDTH + CONTAINER_PADDING * 2) / 2,
              width: CONTAINER_WIDTH,
              //marginTop: 35,
              // marginRight: 10,
            },
          ]}
        >
          <Image
            source={(icons.folderoutline || icons.anonymous) as unknown as ImageSourcePropType}
            style={{ width: 25, height: 25, tintColor: "white" }}
          />
        </TouchableOpacity>

        <View style={styles.directionRowItemsCenter}>
          <TouchableOpacity onPress={() => setCameraMode("picture")}>
            <Text
              style={{
                fontWeight: cameraMode === "picture" ? "bold" : "100",
                color: "white",
              }}
            >
              Snap
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCameraMode("video")}>
            <Text
              style={{
                fontWeight: cameraMode === "video" ? "bold" : "100",
                color: "white",
              }}
            >
              Video
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            {
              backgroundColor: "#00000050",
              padding: CONTAINER_PADDING,
              borderRadius: (CONTAINER_WIDTH + CONTAINER_PADDING * 2) / 2,
              width: CONTAINER_WIDTH,
              //marginTop: 35,
              // marginRight: 10,
            },
          ]}
        >
          <Image
            source={(icons.searchsharp || icons.anonymous) as unknown as ImageSourcePropType}
            style={{ width: 24, height: 24, tintColor: "white" }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    );
  }

  async function requestAllPermissions() {
    // Request camera permissions
    try {
      const cameraGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs camera access to take photos',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (cameraGranted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert("Error", "Camera permissions is required");
        return false;
      }
    } catch (err) {
      console.warn(err);
      Alert.alert("Error", "Camera permissions is required");
      return false;
    }

    // Request microphone permissions
    try {
      const microphoneGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message: 'App needs microphone access to record audio',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (microphoneGranted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert("Error", "Microphone permission is required");
        return false;
      }
    } catch (err) {
      console.warn(err);
      Alert.alert("Error", "Microphone permission is required");
      return false;
    }

    // Request media library permissions
    try {
      const mediaLibraryGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Media Library Permission',
          message: 'App needs access to your media library',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (mediaLibraryGranted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert("Error", "Media Library permission is required");
        return false;
      }
    } catch (err) {
      console.warn(err);
      Alert.alert("Error", "Media Library permission is required");
      return false;
    }

    return true;
  }
  async function handleContinue() {
    const allPermissions = await requestAllPermissions();
    if (!allPermissions) {
      Alert.alert(
        "To continue using this app please provide permissions in settings"
      );
    }
  }

  useEffect(() => {
    handleContinue();
  }, []);

  async function handleOpenQRCode() {
    setIsBrowsing(true);
    const browserResult = await WebBrowser.openBrowserAsync(qrCodeDetected, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
    });
    if (browserResult.type === "cancel") {
      setIsBrowsing(false);
    }
  }

  function handleBarcodeScanned(scanningResult: { data?: string }) {
    if (scanningResult.data) {
      console.log(scanningResult.data);
      setQrCodeDetected(scanningResult.data);
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setQrCodeDetected("");
    }, 1000);
  }

  if (cameraError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red', textAlign: 'center' }}>{cameraError}</Text>
        <TouchableOpacity
          style={{ marginTop: 20 }}
          onPress={() => {
            setCameraError(null);
            setCameraFacing('back');
            setCameraFlash('off');
            setCameraTorch(false);
            setCameraZoom(0);
          }}
        >
          <Text style={{ color: 'blue' }}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (picture) return <PictureView picture={picture} setPicture={setPicture} />;
  if (isBrowsing) return <></>;

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing={cameraFacing as "front" | "back"}
        flash={cameraFlash as "on" | "off" | "auto"}
        zoom={cameraZoom}
        onBarcodeScanned={handleBarcodeScanned}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <CameraTools
              cameraZoom={cameraZoom}
              cameraFlash={cameraFlash}
              cameraTorch={cameraTorch}
              setCameraZoom={setCameraZoom}
              setCameraFacing={setCameraFacing}
              setCameraTorch={setCameraTorch}
              setCameraFlash={setCameraFlash}
            />
            <MainRowActions
              cameraMode={cameraMode}
              handleTakePicture={
                cameraMode === "picture" ? handleTakePicture : toggleRecord
              }
              isRecording={isRecording}
            />
            <QRCodeButton handleOpenQRCode={handleOpenQRCode} />
            <BottomRowTools
              setCameraMode={setCameraMode}
              cameraMode={cameraMode}
            />
          </View>
        </SafeAreaView>
      </CameraView>
    </View>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  directionRowItemsCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  bottomContainer: {
    width: "100%",
    justifyContent: "space-between",
    position: "absolute",
    alignSelf: "center",
    bottom: 6,
  },
  mainRowContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 45,
    height: 100,
  },
});
