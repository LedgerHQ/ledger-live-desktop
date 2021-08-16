import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function StreamRegular({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.64014 7.34404H16.5601V5.71204H2.64014V7.34404ZM2.64014 18.288H16.5601V16.656H2.64014V18.288ZM7.44014 12.816H21.3601V11.184H7.44014V12.816Z"
        fill={color}
      />
    </svg>
  );
}

export default StreamRegular;
