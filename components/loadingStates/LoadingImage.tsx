import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '@/constants';

interface LoadingImageProps {
  size?: 'small' | 'large' | number;
  color?: string;
  containerStyle?: any;
}

export const LoadingImage: React.FC<LoadingImageProps> = ({
  size = 'large',
  color = COLORS.primary,
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
});

export default LoadingImage;
