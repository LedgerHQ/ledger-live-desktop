import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ArrowToBottomUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.0001 17.22L17.4961 11.724L16.9441 11.172L14.7121 13.404C13.9681 14.172 13.1761 14.964 12.4081 15.732V3.3H11.5921V15.732L9.2881 13.404L7.0561 11.172L6.5041 11.724L12.0001 17.22ZM3.6001 20.7H20.4001V19.86H3.6001V20.7Z"
        fill={color}
      />
    </svg>
  );
}

export default ArrowToBottomUltraLight;
