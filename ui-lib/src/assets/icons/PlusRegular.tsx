import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function PlusRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20.4001 11.184H12.8161V3.59998H11.1841V11.184H3.6001V12.816H11.1841V20.4H12.8161V12.816H20.4001V11.184Z"
        fill={color}
      />
    </svg>
  );
}

export default PlusRegular;
