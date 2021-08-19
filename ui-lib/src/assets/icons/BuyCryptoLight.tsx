import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function BuyCryptoLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.63993 12H3.79193V6.67201H20.2799C19.7519 7.17601 19.1999 7.70401 18.6959 8.20801L17.2319 9.69601L17.9759 10.44L22.3199 6.09601L17.9759 1.75201L17.2319 2.52001L18.6959 3.98401C19.1999 4.48801 19.7279 5.01601 20.2559 5.52001H2.63993V12ZM1.67993 17.904L6.02393 22.248L6.79193 21.48L5.32793 20.016C4.82393 19.512 4.27193 18.984 3.74393 18.48H21.3599V12H20.2079V17.328H3.71993C4.27193 16.8 4.79993 16.296 5.32793 15.768L6.79193 14.304L6.02393 13.536L1.67993 17.904Z"
        fill={color}
      />
    </svg>
  );
}

export default BuyCryptoLight;
