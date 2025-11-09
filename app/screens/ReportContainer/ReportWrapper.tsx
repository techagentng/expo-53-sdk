import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
} from "react-native";
import React from "react";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from "@react-navigation/native";
import { icons, COLORS } from "@/constants";
import TextButton from "../../components/TextButton";
import type { ImageSourcePropType } from "react-native";

interface ReportWrapperProps {
  children: React.ReactNode;
  title: string;
}

const ReportWrapper: React.FC<ReportWrapperProps> = ({ children, title }) => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView 
      style={styles.parentContainer}
      contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
    >
      <View style={styles.topContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.imageContainer}
        >
          <Image
            source={(icons.arrowleft || icons.anonymous) as unknown as ImageSourcePropType}
            style={{ width: 20, height: 20, tintColor: "black" }}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.saveText}>Save Draft</Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginBottom: 15 }}>
        <Text style={styles.miniTitle}>
          Fill in the form with the relevant details
        </Text>
        <View
          style={{
            backgroundColor: "gray",
            width: "100%",
            height: 1,
            marginTop: 12,
            marginBottom: 35,
          }}
        />
        <Text style={styles.title}>{title}</Text>
      </View>
      {children}
    </ScrollView>
  );
};

export default ReportWrapper;

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
    flexDirection: "column",
    marginTop: StatusBar.currentHeight || 40,
    paddingHorizontal: 18,
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "space-between",
  },
  imageContainer: {
    width: 32,
    height: 30,
  },
  image: {
    flex: 1,
    width: 30,
    height: 25,
  },
  saveText: {
    fontWeight: "500",
    fontSize: 16,
    color: "#0276FF",
  },
  miniTitle: {
    fontWeight: "500",
    fontSize: 14,
  },
  title: {
    color: `${COLORS.primary}`,
    fontWeight: "700",
    fontSize: 20,
    lineHeight: 28,
  },
});
