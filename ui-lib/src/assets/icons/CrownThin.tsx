import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function CrownThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.12012 16.32H20.8801V5.328L15.7681 9.168L12.0001 4.44L8.23212 9.168L3.12012 5.328V16.32ZM3.12012 19.56H20.8801V19.08H3.12012V19.56ZM3.60012 15.84V6.288L8.30412 9.84L12.0001 5.208L15.6961 9.84L20.4001 6.288V15.84H3.60012Z"
        fill={color}
      />
    </svg>
  );
}

export default CrownThin;
