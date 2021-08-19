import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function LogsRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.69995 13.308H21.2999V11.748H2.69995V13.308ZM2.69995 18.828H16.5V17.268H2.69995V18.828ZM2.69995 8.868L5.67595 7.02L2.69995 5.172V8.868ZM7.69195 7.788H21.2999V6.228H7.69195V7.788Z"
        fill={color}
      />
    </svg>
  );
}

export default LogsRegular;
