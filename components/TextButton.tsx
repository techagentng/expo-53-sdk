import React from 'react';
import { TouchableOpacity, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { COLORS, SIZES } from '@/constants';

interface TextButtonProps {
  label: string;
  onPress: () => void;
  buttonContainerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
}

export const TextButton: React.FC<TextButtonProps> = ({
  label,
  onPress,
  buttonContainerStyle,
  labelStyle,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, buttonContainerStyle, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={[styles.label, labelStyle]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.padding / 2,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.radius,
  },
  label: {
    color: COLORS.primary,
    fontSize: SIZES.body4,
    fontWeight: '500',
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default TextButton;
