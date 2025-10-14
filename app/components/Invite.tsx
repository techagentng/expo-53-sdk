import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React from "react";
import { COLORS, icons } from "@/constants";

const Invite = () => {
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.linkText}>https://www.citizenx.ng</Text>
        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkButtonText}>copy link</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inviteInfoContainer}>
        <Text style={styles.inviteInfoText}>
          Invite friends to get 10 points instantly when they register. Get a
          bonus whenever they make report.
        </Text>

        {icons.gifticon ? (
          <Image source={icons.gifticon} style={{ width: 95, height: 95 }} />
        ) : (
          <View
            style={{
              width: 95,
              height: 95,
              backgroundColor: COLORS.gray,
              borderRadius: 10,
            }}
          />
        )}
      </View>

      <View style={styles.invitedFriendsContainer}>
        <Text style={styles.invitedFriendsTitle}>Invited Friends</Text>
        <Text>None</Text>
      </View>
    </View>
  );
};

export default Invite;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    flex: 1,
    paddingHorizontal: 5,
  },
  inputContainer: {
    width: "100%",
    height: 55,
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    marginTop: 25,
    borderColor: COLORS.gray,
    borderRadius: 8,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4,
  },
  linkButton: {
    backgroundColor: COLORS.gray,
    width: 68,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4,
  },
  linkButtonText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 13,
  },
  linkText: {
    fontWeight: "700",
    fontSize: 13,
    lineHeight: 20,
  },
  inviteInfoContainer: {
    marginTop: 25,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  inviteInfoText: {
    fontWeight: "500",
    fontSize: 15,
    color: "#000000CC",
  },
  invitedFriendsContainer: {
    marginTop: 10,
  },
  invitedFriendsTitle: {
    fontWeight: "700",
    fontSize: 14,
    lineHeight: 20,
  },
});
