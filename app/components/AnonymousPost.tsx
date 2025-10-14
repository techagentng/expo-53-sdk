import { View, Text, Image, StyleSheet, Switch } from "react-native";
import { COLORS, icons } from "@/constants";

export default function AnonymousPost({ isEnabled, setIsEnabled }: {
  isEnabled: boolean;
  setIsEnabled: (value: boolean) => void;
}) {
  //const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(!isEnabled);
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        height: 60,
        width: "100%",
        padding: 5,
      }}
    >
      <Image
        source={require("@/assets/images/citizenx.png")}
        style={styles.image}
      />
      <Text
        style={{
          fontWeight: 500,
          fontSize: 14,
          lineHeight: 20,
        }}
      >
        Post as Anonymous Reporter
      </Text>
      <View style={styles.switchContainer}>
        <Switch
          trackColor={{ false: "#767577", true: `${COLORS.primary}` }}
          thumbColor={isEnabled ? `${COLORS.primary}` : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 46,
    height: 50,
    borderRadius:10
  },
  switchContainer: {
    transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
  },
});
