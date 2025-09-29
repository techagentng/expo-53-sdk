// src/components/ui/IconButton.tsx

import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

interface IconButtonProps {
  icon: any;
  onPress: () => void;
  tintColor?: string;
  size?: number;
  style?: any;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  tintColor = '#000',
  size = 24,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.6}
    >
      <Image
        source={icon}
        style={[
          styles.icon,
          {
            width: size,
            height: size,
            tintColor,
          },
        ]}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
  icon: {
    // Styles are applied dynamically
  },
});

export default IconButton;