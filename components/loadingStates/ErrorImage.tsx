import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { COLORS, SIZES, icons } from '@/constants';

interface ErrorImageProps {
  message?: string;
  containerStyle?: any;
}

export const ErrorImage: React.FC<ErrorImageProps> = ({
  message = "Something went wrong",
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={{ fontSize: 60, marginBottom: SIZES.padding }}>⚠️</Text>
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: SIZES.padding,
  },
  message: {
    fontSize: SIZES.body3,
    color: COLORS.red,
    textAlign: 'center',
    marginTop: SIZES.base,
  },
});

export default ErrorImage;
