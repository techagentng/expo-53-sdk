// src/components/ui/Card.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: any;
}

const Card: React.FC<CardProps> = ({ children, style }) => {
  return (
    <View style={[styles.container, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 16,
    marginVertical: 8,
  },
});

export default Card;