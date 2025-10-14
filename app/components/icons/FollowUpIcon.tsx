import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface FollowUpIconProps {
  size?: number;
  color?: string;
}

export const FollowUpIcon: React.FC<FollowUpIconProps> = ({
  size = 24,
  color = '#000000'
}) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13.213 9.787a3.391 3.391 0 0 0-4.795 0l-3.425 3.426a3.39 3.39 0 0 0 4.795 4.794l.321-.304m-.321-4.49a3.39 3.39 0 0 0 4.795 0l3.424-3.426a3.39 3.39 0 0 0-4.794-4.795l-1.028.961"
      />
    </Svg>
  );
};

export default FollowUpIcon;
