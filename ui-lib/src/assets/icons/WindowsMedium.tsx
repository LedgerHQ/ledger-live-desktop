import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function WindowsMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.2561 11.6401H20.4001V3.6001L11.2561 4.8721V11.6401ZM3.6001 18.0961L10.5121 19.0321V12.4561H3.6001V18.0961ZM3.6001 11.6401H10.5121V4.9681L3.6001 5.9041V11.6401ZM11.2561 19.1281L20.4001 20.4001V12.4561H11.2561V19.1281Z"
        fill={color}
      />
    </svg>
  );
}

export default WindowsMedium;
