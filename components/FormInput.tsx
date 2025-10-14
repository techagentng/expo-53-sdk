import React from 'react';
import { View, TextInput, Text, StyleSheet, StyleProp, ViewStyle, TextStyle, TextInputProps } from 'react-native';
import { COLORS, SIZES } from '@/constants';

interface FormInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  containerStyle,
  inputContainerStyle,
  labelStyle,
  rightIcon,
  leftIcon,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <View style={[styles.inputContainer, inputContainerStyle, error ? styles.errorInput : {}]}>
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
        <TextInput
          style={[styles.input, leftIcon ? styles.inputWithLeftIcon : undefined]}
          placeholderTextColor={COLORS.gray}
          {...props}
        />
        {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.padding,
  },
  label: {
    marginBottom: 8,
    fontSize: SIZES.body4,
    color: COLORS.darkGray,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.lightGray2,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: SIZES.body4,
    color: COLORS.black,
  },
  inputWithLeftIcon: {
    marginLeft: 8,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    marginTop: 4,
    color: COLORS.red,
    fontSize: SIZES.body5,
  },
  errorInput: {
    borderColor: COLORS.red,
  },
});

export default FormInput;
