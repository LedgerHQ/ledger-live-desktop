import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function TransferThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.0159 12.288L21.3599 7.94401L17.0159 3.60001L16.6799 3.93601L18.5519 5.80801L20.4479 7.70401H3.59989V8.18401H20.4479L18.5519 10.08L16.6799 11.952L17.0159 12.288ZM2.63989 16.056L6.98389 20.4L7.31989 20.064L5.44789 18.192L3.55189 16.296H20.3999V15.816H3.55189L5.44789 13.92L7.31989 12.048L6.98389 11.712L2.63989 16.056Z"
        fill={color}
      />
    </svg>
  );
}

export default TransferThin;
