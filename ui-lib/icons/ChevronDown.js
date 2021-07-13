// @flow

import React from "react";

const ChevronDown = ({ size, color = "currentColor" }: { size: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M11.3685 0.739573L10.8985 0.244782C10.7748 0.121084 10.5769 0.121084 10.4779 0.244782L6.00004 4.72265L1.49744 0.244782C1.39848 0.121084 1.20056 0.121084 1.07686 0.244782L0.606812 0.739573C0.483114 0.838532 0.483114 1.03645 0.606812 1.16015L5.77738 6.33072C5.90108 6.45442 6.07426 6.45442 6.19796 6.33072L11.3685 1.16015C11.4922 1.03645 11.4922 0.838532 11.3685 0.739573Z"
      fill={color}
    />
  </svg>
);

export default ChevronDown;
