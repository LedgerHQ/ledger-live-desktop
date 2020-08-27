// @flow

import React from "react";

const Ban = ({ size = 16, color = "currentColor" }: { size?: number, color?: string }) => (
  <svg height={size} width={size} viewBox="0 0 22 22">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M5.38211 3.96826C6.92181 2.73654 8.87489 2 11 2C15.9706 2 20 6.02944 20 11C20 13.1251 19.2635 15.0782 18.0317 16.6179L5.38211 3.96826ZM3.96794 5.38252C2.73641 6.92216 2 8.87508 2 11C2 15.9706 6.02944 20 11 20C13.1249 20 15.0778 19.2636 16.6175 18.0321L3.96794 5.38252ZM11 0C4.92487 0 0 4.92487 0 11C0 17.0751 4.92487 22 11 22C17.0751 22 22 17.0751 22 11C22 4.92487 17.0751 0 11 0Z"
      fill={color}
    />
  </svg>
);

export default Ban;
