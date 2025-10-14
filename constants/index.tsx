// Re-export everything from theme
export { COLORS, SIZES, FONTS } from "./theme";

// Import and re-export icons with different name to avoid conflicts
import iconsData from "./icons";
export { iconsData as icons };

// Re-export theme as default
export { default as theme } from "./theme";
