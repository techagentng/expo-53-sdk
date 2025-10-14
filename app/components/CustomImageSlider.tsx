import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ImageSourcePropType,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

const { width: viewportWidth } = Dimensions.get("window");

interface CustomImageSliderProps {
  images: ImageSourcePropType[];
  contentContainerStyle?: StyleProp<ViewStyle>;
}

const CustomImageSlider: React.FC<CustomImageSliderProps> = ({ images, contentContainerStyle }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList | null>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / viewportWidth);
    console.log("Scroll Event: ", contentOffsetX, " Index: ", index);
    setActiveIndex(index);
  };

  const renderItem = ({ item }: { item: ImageSourcePropType }) => (
    <View style={styles.imageContainer}>
      <Image source={item} style={styles.image} />
    </View>
  );

  return (
    <View style={styles.sliderContainer}>
      <FlatList
        data={images}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        ref={flatListRef}
        contentContainerStyle={[styles.flatList, contentContainerStyle]}
        snapToAlignment="center"
        decelerationRate="fast"
        scrollEventThrottle={16} // Add this line
      />
      <View style={styles.pagination}>
        {images.map((_, index) => (
          <Text
            key={index}
            style={[
              styles.dot,
              { color: index === activeIndex ? "black" : "gray" },
            ]}
          >
            ●
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  flatList: {
    width: viewportWidth,
  },
  imageContainer: {
    width: viewportWidth,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: viewportWidth,
    height: viewportWidth * 0.92,
    resizeMode: "cover",
    borderRadius: 5,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    fontSize: 19,
    marginHorizontal: 1,
  },
});

export default CustomImageSlider;
