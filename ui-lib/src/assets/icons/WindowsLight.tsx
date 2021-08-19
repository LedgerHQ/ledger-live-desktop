import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function WindowsLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.2561 11.64H20.4001V3.59998L11.2561 4.87198V11.64ZM3.6001 18.096L10.5121 19.032V12.456H3.6001V18.096ZM3.6001 11.64H10.5121V4.96798L3.6001 5.90398V11.64ZM11.2561 19.128L20.4001 20.4V12.456H11.2561V19.128Z"
        fill={color}
      />
    </svg>
  );
}

export default WindowsLight;
