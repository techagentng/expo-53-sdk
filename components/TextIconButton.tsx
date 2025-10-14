import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet, StyleProp, ViewStyle, TextStyle, ImageStyle, ImageSourcePropType } from 'react-native';
import { COLORS, SIZES } from '@/constants';

export interface TextIconButtonProps {
  label: string;
  icon: ImageSourcePropType;
  onPress: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<ImageStyle>;
  iconPosition?: 'LEFT' | 'RIGHT';
  disabled?: boolean;
}

export const TextIconButton: React.FC<TextIconButtonProps> = ({
  label,
  icon,
  onPress,
  containerStyle,
  labelStyle,
  iconStyle,
  iconPosition = 'LEFT',
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, containerStyle, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      {iconPosition === 'LEFT' && (
        <Image
          source={icon}
          style={[styles.icon, iconStyle]}
          resizeMode="contain"
        />
      )}
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      {iconPosition === 'RIGHT' && (
        <Image
          source={icon}
          style={[styles.icon, iconStyle]}
          resizeMode="contain"
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.padding / 2,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.radius,
  },
  icon: {
    width: 20,
    height: 20,
  },
  label: {
    color: COLORS.black,
    fontSize: SIZES.body4,
    fontWeight: '500',
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default TextIconButton;
