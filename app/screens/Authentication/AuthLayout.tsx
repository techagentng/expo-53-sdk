import React, { ReactNode } from 'react';
import {
  View,
  Text,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { SIZES, COLORS } from "@/constants";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  // Add your screen params here
  // Example:
  // Home: undefined;
  // Profile: { userId: string };
};

type AuthLayoutProps = {
  title?: string;
  subtitle?: string;
  titleContainerStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  children: ReactNode;
};

const AuthLayout = ({
  title,
  subtitle,
  titleContainerStyle,
  children,
  containerStyle,
}: AuthLayoutProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
 
  const containerStyles: ViewStyle = {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 20,
    ...(containerStyle as object)
  };

  const titleContainerStyles: ViewStyle = {
    marginTop: SIZES.padding,
    ...(titleContainerStyle as object)
  };

  return (
    <View style={containerStyles}>
      <KeyboardAwareScrollView
        keyboardDismissMode="on-drag"
        contentContainerStyle={{
          flex: 1,
          paddingHorizontal: SIZES.padding,
        }}
      >
        {/** App Icon */}
        <View
          style={{
            alignItems: "center",
            marginTop: 15,
          }}
        >
          <View
            style={{
              height: 50,
              width: 50,
              borderRadius: 25,
              backgroundColor: "#104833",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "white",
              }}
            >
              CX
            </Text>
          </View>
        </View>
        {/** Title & SubTitle */}
        <View style={titleContainerStyles}>
          <Text
            style={{
              textAlign: "center",
              fontWeight: "700",
              fontSize: 16,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              textAlign: "center",
              color: "black",
              marginTop: 2,
              fontWeight: "500",
              fontSize: 14,
            }}
          >
            {subtitle}
          </Text>
        </View>
        {children}
      </KeyboardAwareScrollView>
    </View>
  );
};

export default AuthLayout;
