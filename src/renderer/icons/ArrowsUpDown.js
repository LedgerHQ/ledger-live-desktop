// @flow

import React from "react";

const ArrowsUpDown = ({
  size = 16,
  color = "currentColor",
  ...p
}: {
  size: number,
  color?: string,
}) => (
  <svg height={size} width={size} viewBox="0 0 16 18" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3.99929 16.2727V1.72728M3.99929 1.72728L7.27202 5.00001M3.99929 1.72728L0.726562 5.00001"
      stroke={color}
      strokeWidth="1.6"
    />
    <path
      d="M12.0007 1.72727L12.0007 16.2727M12.0007 16.2727L8.72798 13M12.0007 16.2727L15.2734 13"
      stroke={color}
      strokeWidth="1.6"
    />
  </svg>
);

export default ArrowsUpDown;
