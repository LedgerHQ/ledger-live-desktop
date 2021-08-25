import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function StreamMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.64014 7.54806H16.5601V5.50806H2.64014V7.54806ZM2.64014 18.4921H16.5601V16.4521H2.64014V18.4921ZM7.44014 13.0201H21.3601V10.9801H7.44014V13.0201Z"
        fill={color}
      />
    </svg>
  );
}

export default StreamMedium;
