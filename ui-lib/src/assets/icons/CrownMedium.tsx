import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function CrownMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.63989 16.4401H21.3599V4.51209L15.8639 8.68809L11.9999 3.84009L8.13589 8.68809L2.63989 4.51209V16.4401ZM2.63989 20.1601H21.3599V18.3601H2.63989V20.1601ZM4.51189 14.6401V8.23209L8.47189 11.2321L11.9999 6.79209L15.5279 11.2321L19.4879 8.23209V14.6401H4.51189Z"
        fill={color}
      />
    </svg>
  );
}

export default CrownMedium;
