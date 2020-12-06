// @flow

import React from "react";

const ArrowShortCorner = ({
  flippedX = false,
  flippedY = false,
}: {
  flippedX?: boolean,
  flippedY?: boolean,
}) => {
  const [scaleX, translateX] = flippedX ? [-1, 45] : [1, 0];
  const [scaleY, translateY] = flippedY ? [-1, 54] : [1, 0];
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={"45"}
      height={"54"}
      viewBox="0 0 45 54"
      fill="none"
    >
      <path
        transform={`translate(${translateX} ${translateY}) scale(${scaleX} ${scaleY})`}
        d="M7.99947 37.5004L8.99947 37.5004L7.99947 37.5004ZM7.29232 53.7071C7.68284 54.0976 8.316 54.0976 8.70653 53.7071L15.0705 47.3432C15.461 46.9526 15.461 46.3195 15.0705 45.929C14.68 45.5384 14.0468 45.5384 13.6563 45.929L7.99943 51.5858L2.34259 45.9289C1.95207 45.5384 1.3189 45.5384 0.928375 45.9289C0.537853 46.3194 0.537849 46.9526 0.928371 47.3431L7.29232 53.7071ZM6.99947 37.5004L6.99942 53L8.99942 53L8.99947 37.5004L6.99947 37.5004ZM44.5 0C23.7891 -2.00409e-06 6.99952 16.7895 6.99947 37.5004L8.99947 37.5004C8.99952 17.8941 24.8936 2 44.5 2L44.5 0Z"
        fill="white"
      />
    </svg>
  );
};

export default ArrowShortCorner;
