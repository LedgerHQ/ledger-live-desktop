// @flow

import React from "react";

const Facebook = ({ size, color = "currentColor" }: { size: number, color?: string }) => (
  <svg height={size} width={size} viewBox="0 0 13 23">
    <path
      fill={color}
      d="M11.9883 13.125L12.5898 9.17188H8.76562V6.59375C8.76562 5.47656 9.28125 4.44531 11 4.44531H12.7617V1.05078C12.7617 1.05078 11.1719 0.75 9.66797 0.75C6.53125 0.75 4.46875 2.68359 4.46875 6.12109V9.17188H0.945312V13.125H4.46875V22.75H8.76562V13.125H11.9883Z"
    />
  </svg>
);

export default Facebook;
