import { Animated, View, TouchableOpacity, Text } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import SavedDraft from "./SavedDraft";
import BookMark from "./Bookmark";
import UserPost from "./UserPost";
import { icons } from "@/constants";

const Tab = createMaterialTopTabNavigator();

export default function BottomTabFeed() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600', color: '#0E9C67' },
        tabBarIndicatorStyle: { backgroundColor: '#0E9C67', height: 3 },
        tabBarStyle: { backgroundColor: '#fff' },
      }}
    >
      <Tab.Screen
        name="User Posts"
        component={UserPost}
        options={{
          tabBarLabel: 'My Posts',
          tabBarIcon: ({ focused }) => (
            <View style={{ marginRight: 8 }}>
              <Text style={{ fontSize: 16, color: focused ? "#0E9C67" : "#666" }}>
                📋
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Bookmarked"
        component={BookMark}
        options={{
          tabBarLabel: 'Bookmarked',
          tabBarIcon: ({ focused }) => (
            <View style={{ marginRight: 8 }}>
              <Text style={{ fontSize: 16, color: focused ? "#0E9C67" : "#666" }}>
                ⭐
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Drafts"
        component={SavedDraft}
        options={{
          tabBarLabel: 'Drafts',
          tabBarIcon: ({ focused }) => (
            <View style={{ marginRight: 8 }}>
              <Text style={{ fontSize: 16, color: focused ? "#0E9C67" : "#666" }}>
                📝
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
