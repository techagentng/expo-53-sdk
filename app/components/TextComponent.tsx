import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState } from "react";

interface TextComponentProps {
  text: string | undefined;
}

const TextComponent = ({ text }: TextComponentProps) => {
  const [showFullText, setShowFullText] = useState(false);

  const toggleTextDisplay = () => {
    setShowFullText(!showFullText);
  };

  const truncatedText = (text && text.length > 45) ? text.substring(0, 45) + "..." : text || "";

  return (
    <View>
      <Text style={styles.feedContent}>
        {showFullText ? (text || "") : truncatedText}
      </Text>
      {text && text.length > 45 && (
        <TouchableOpacity onPress={toggleTextDisplay}>
          <Text style={styles.showMoreButton}>
            {showFullText ? "Show Less" : "Show More"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default TextComponent;

const styles = StyleSheet.create({
  feedContent: {
    textAlign: "left",
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 19.6,
    color: "black",
  },
  showMoreButton: {
    color: "black",
    fontWeight: "500",
    fontSize: 14,
    marginBottom: 10,
  },
});
