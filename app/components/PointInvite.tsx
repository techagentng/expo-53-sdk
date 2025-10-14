import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Task from "./Task";
import Invite from "./Invite";

const Tab = createMaterialTopTabNavigator();

const PointInvite = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: "#AFFFE1",
          borderRadius: 10,
          padding: 5,
        },
        tabBarLabel: ({ focused }) => (
          <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>
            {route.name}
          </Text>
        ),
      })}
    >
      <Tab.Screen name="Task" component={Task} />
      <Tab.Screen name="Invite" component={Invite} />
    </Tab.Navigator>
  );
};

export default PointInvite;

const styles = StyleSheet.create({
    tabLabel: {
        color: "black", 
        paddingHorizontal: 50,
        paddingVertical:5,    
      },
      tabLabelFocused: {
        backgroundColor: "white", 
        borderRadius: 5,         
      },
});
