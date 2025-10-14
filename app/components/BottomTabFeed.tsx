import { Animated, View, TouchableOpacity } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import SavedDraft from "./SavedDraft";
import BookMark from "./Bookmark";
import UserPost from "./UserPost";

const Tab = createMaterialTopTabNavigator();

export default function BottomTabFeed() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontSize: 15, fontWeight: 'bold', color: '#0E9C67' },
        tabBarIndicatorStyle: { backgroundColor: '#0E9C67', height: 3 },
        tabBarStyle: { backgroundColor: '#fff' },
      }}
    >
      <Tab.Screen name="User Posts" component={UserPost} options={{ tabBarLabel: 'My Posts' }} />
      <Tab.Screen name="Bookmarked" component={BookMark} options={{ tabBarLabel: 'Bookmarked' }} />
      <Tab.Screen name="Drafts" component={SavedDraft} options={{ tabBarLabel: 'Drafts' }} />
    </Tab.Navigator>
  );
}
