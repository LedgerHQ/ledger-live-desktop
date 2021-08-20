import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function StarThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.64018 21.816L12.0002 17.16L18.3602 21.816L15.9122 14.256L22.3202 9.55199H14.3762L12.0002 2.18399L9.62418 9.55199H1.68018L8.06418 14.256L5.64018 21.816ZM3.14418 10.032H9.98418L12.0002 3.74399L14.0162 10.032H20.8562L15.3602 14.064L17.4482 20.544L12.0002 16.56L6.55218 20.568L8.61618 14.064L3.14418 10.032Z"
        fill={color}
      />
    </svg>
  );
}

export default StarThin;
