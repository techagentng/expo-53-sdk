import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FONTS, SIZES, COLORS } from '@/constants';

export interface AuthLayoutSignUpProps {
  children: React.ReactNode;
  title: string;
  subTitle: string;
  steps?: string;
  containerStyle?: ViewStyle;
}

export default function AuthLayoutSignUp({
  children,
  title,
  subTitle,
  steps = "",
  containerStyle,
}: AuthLayoutSignUpProps) {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={{ ...styles.layoutContainer, ...containerStyle, paddingBottom: insets.bottom + 20 }}>
      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: 15,
        }}
      >
        <View style={styles.textContainer}>
          <Text
            style={{
              fontWeight: "800",
              fontSize: 14,
              color: COLORS.primary,
              lineHeight: 16,
            }}
          >
            {steps}
          </Text>
          <Text
            style={{
              fontWeight: "700",
              fontSize: 24,
              lineHeight: 33.3,
              marginVertical: 5,
            }}
          >
            {title}
          </Text>
          <Text style={{ fontWeight: "500", fontSize: 14, lineHeight: 19 }}>
            {subTitle}
          </Text>
        </View>
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  layoutContainer: {
    flex: 1,
  },
  textContainer: {
    marginTop: 5,
  },
});
