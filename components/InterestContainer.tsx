import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { COLORS } from "@/constants";

interface InterestContainerProps {
  id: number;
  title: string;
}

const InterestContainer: React.FC<InterestContainerProps> = ({ id, title }) => {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected && styles.selectedContainer,
      ]}
      onPress={() => setIsSelected(!isSelected)}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.title,
          isSelected && styles.selectedTitle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 12,
    margin: 6,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 60,
  },
  selectedContainer: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}10`,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  selectedTitle: {
    color: COLORS.primary,
    fontWeight: "700",
  },
});

export default InterestContainer;
