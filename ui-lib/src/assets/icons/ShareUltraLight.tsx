import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ShareUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.95996 20.46H20.04V11.82H16.32V12.66H19.2V19.62H4.79996V12.66H7.67996V11.82H3.95996V20.46ZM7.65596 7.88399L8.20796 8.43599L9.88796 6.75599C10.44 6.20399 11.04 5.60399 11.592 5.02799V16.5H12.408V5.00399C12.984 5.60399 13.56 6.17999 14.136 6.75599L15.816 8.43599L16.344 7.88399L12 3.53999L7.65596 7.88399Z"
        fill={color}
      />
    </svg>
  );
}

export default ShareUltraLight;
