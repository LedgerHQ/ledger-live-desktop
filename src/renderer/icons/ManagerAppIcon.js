// @flow

import React from "react";

const ManagerAppIcon = ({
  size = 40,
  color = "currentColor",
}: {
  size: number,
  color?: string,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 20C0 13.1242 0 9.68631 1.30266 7.04478C2.53251 4.55089 4.55089 2.53251 7.04478 1.30266C9.68631 0 13.1242 0 20 0C26.8758 0 30.3137 0 32.9552 1.30266C35.4491 2.53251 37.4675 4.55089 38.6973 7.04478C40 9.68631 40 13.1242 40 20C40 26.8758 40 30.3137 38.6973 32.9552C37.4675 35.4491 35.4491 37.4675 32.9552 38.6973C30.3137 40 26.8758 40 20 40C13.1242 40 9.68631 40 7.04478 38.6973C4.55089 37.4675 2.53251 35.4491 1.30266 32.9552C0 30.3137 0 26.8758 0 20Z"
      fill={color}
      fillOpacity="0.3"
    />
    <rect x="9" y="9" width="10" height="10" rx="2" fill={color} fillOpacity="0.6" />
    <rect x="9" y="21" width="10" height="10" rx="2" fill={color} fillOpacity="0.6" />
    <rect x="21" y="9" width="10" height="10" rx="2" fill={color} fillOpacity="0.6" />
    <rect x="21" y="21" width="10" height="10" rx="2" fill={color} fillOpacity="0.6" />
  </svg>
);

export default ManagerAppIcon;
