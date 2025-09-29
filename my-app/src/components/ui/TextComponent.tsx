// src/components/ui/TextComponent.tsx

import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface TextComponentProps {
  text: string;
  style?: any;
}

const TextComponent: React.FC<TextComponentProps> = ({ text, style }) => {
  return (
    <Text style={[styles.text, style]}>
      {text}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
});

export default TextComponent;
