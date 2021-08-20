import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function QuitThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.0799 21.36H21.5999V2.64001H10.0799V7.68002H10.5599V3.12001H21.1199V20.88H10.5599V16.32H10.0799V21.36ZM2.3999 12L6.7439 16.344L7.0799 16.008L5.2079 14.136L3.3119 12.24H15.8399V11.76H3.3119L5.2079 9.86402L7.0799 7.99201L6.7439 7.65601L2.3999 12Z"
        fill={color}
      />
    </svg>
  );
}

export default QuitThin;
