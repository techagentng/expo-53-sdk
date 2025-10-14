import React from 'react';
import { ActivityIndicator as RNActivityIndicator, Platform } from 'react-native';
import { COLORS, SIZES } from '@/constants/theme';

// Map of string sizes to their numeric equivalents
const sizeMap = {
  small: 20, // Always use numeric values for Android compatibility
  large: 36,
  default: SIZES.ACTIVITY_INDICATOR,
};

const CustomActivityIndicator = ({
  size = SIZES.ACTIVITY_INDICATOR,
  color = COLORS.primary,
  ...props
}: {
  size?: number | string;
  color?: string;
} & React.ComponentProps<typeof RNActivityIndicator>) => {
  // Convert size to a proper value
  let resolvedSize = SIZES.ACTIVITY_INDICATOR;

  try {
    if (typeof size === 'string') {
      // Handle string sizes (small, large, etc.)
      const lowerSize = size.toLowerCase().trim();
      resolvedSize = sizeMap[lowerSize as keyof typeof sizeMap] || SIZES.ACTIVITY_INDICATOR;
    } else if (typeof size === 'number') {
      // Ensure it's a valid finite number and convert to integer to avoid floating point issues
      resolvedSize = Number.isFinite(size) ? Math.round(Number(size)) : SIZES.ACTIVITY_INDICATOR;
    } else {
      resolvedSize = SIZES.ACTIVITY_INDICATOR;
    }
  } catch (error) {
    resolvedSize = SIZES.ACTIVITY_INDICATOR;
  }

  // Ensure the final value is a number and within reasonable bounds
  resolvedSize = Math.max(1, Math.min(100, Number(resolvedSize) || SIZES.ACTIVITY_INDICATOR));

  // Ensure color is a string
  const resolvedColor = typeof color === 'string' ? color : COLORS.primary;

  return (
    <RNActivityIndicator
      size={resolvedSize}
      color={resolvedColor}
      {...props}
    />
  );
};

// Add prop type validation
CustomActivityIndicator.propTypes = {
  size: (props: any, propName: any, componentName: any ) => {
    const prop = props[propName];
    if (prop !== undefined && 
        prop !== null && 
        typeof prop !== 'number' && 
        typeof prop !== 'string') {
      return new Error(
        `Invalid prop \`${propName}\` of type \`${typeof prop}\` supplied to \`${componentName}\`, expected \`number\` or \`string\`.`
      );
    }
  },
  color: (props: any, propName: any, componentName: any) => {
    const prop = props[propName];
    if (prop !== undefined && prop !== null && typeof prop !== 'string') {
      return new Error(
        `Invalid prop \`${propName}\` of type \`${typeof prop}\` supplied to \`${componentName}\`, expected \`string\`.`
      );
    }
  },
};

export default React.memo(CustomActivityIndicator);
