import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React from "react";
import { COLORS, SIZES } from "@/constants";
import interestData from "@/data/interestData";
import InterestContainer from "@/components/InterestContainer";
import TextButton from "@/components/TextButton";

interface InterestProps {
  navigation: any;
}

const Interest: React.FC<InterestProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <View style={{ width: 50 }} />
        <TouchableOpacity
          onPress={() => {
            navigation.reset({
              index: 0,
              routes: [{ name: "InitialSignUp" }],
            });
          }}
        >
          <Text style={styles.exitText}>Skip</Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginTop: 36, justifyContent: "flex-start" }}>
        <Text style={{ fontWeight: "700", fontSize: 28, lineHeight: 39 }}>
          Choose your interests
        </Text>
        <Text style={{ fontWeight: "500", fontSize: 14, lineHeight: 19 }}>
          Get better report recommendations
        </Text>
      </View>

      <FlatList
        data={interestData}
        renderItem={({ item }) => (
          <InterestContainer id={item.id} title={item.title} />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20, flexGrow: 1 }}
      />

      <TextButton
        label="Next"
        //disabled={isEnableSignIn() ? false : true}
        buttonContainerStyle={{
          height: 55,
          alignItems: "center",
          justifyContent: "center",
          marginTop: SIZES.padding,
          borderRadius: SIZES.radius,
          backgroundColor: "#0E9C67",
          marginBottom: 15,
        }}
        labelStyle={{
          color: COLORS.white,
          fontWeight: "700",
          fontSize: 17,
        }}
        onPress={() => {
          navigation.navigate("InitialSignUp")
          
        }}
      />
    </View>
  );
};

export default Interest;

const styles = StyleSheet.create({
  container: {
    paddingTop: 25,
    paddingHorizontal: 23,
    flex: 1,
    backgroundColor: "white",
  },
  textContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  exitText: {
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 19.6,
    color: COLORS.primary,
  },
});
