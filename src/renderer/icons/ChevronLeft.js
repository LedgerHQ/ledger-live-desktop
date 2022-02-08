// @flow

import i18next from "i18next";
import React from "react";

const ChevronLeft = ({ size, ignoreRtl = false }: { size: number, ignoreRtl?: boolean }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    style={!ignoreRtl && i18next.dir() === "rtl" ? { transform: "scaleX(-1)" } : {}}
  >
    <path
      d="M11.636 0.727496L4.36328 8.00022L11.636 15.2729"
      stroke="currentColor"
      strokeWidth="1.4"
    />
  </svg>
);

export default ChevronLeft;
