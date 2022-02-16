// @flow

import React from "react";

const Logo = ({ size = 16, color = "currentColor" }: { size: number, color?: string }) => (
  <svg
    width={size}
    height={(size / 148) * 128}
    viewBox="0 0 148 128"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 91.6548V128H55.3076V119.94H8.05844V91.6548H0ZM138.98 91.6548V119.94H91.7313V127.998H147.039V91.6548H138.98ZM55.388 36.3452V91.6529H91.7313V84.3842H63.4464V36.3452H55.388ZM0 0V36.3452H8.05844V8.05844H55.3076V0H0ZM91.7313 0V8.05844H138.98V36.3452H147.039V0H91.7313Z"
      fill={color}
    />
  </svg>
);

export default Logo;
