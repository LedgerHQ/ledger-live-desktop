import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function BatteryHalfMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.68018 18.1199H20.3762V15.9599H22.3202V8.03988H20.3762V5.87988H1.68018V18.1199ZM3.60018 16.3199V7.67988H18.4562V9.83988H20.4002V14.1599H18.4562V16.3199H3.60018ZM5.52018 14.3999H12.0002V9.59988H5.52018V14.3999Z"
        fill={color}
      />
    </svg>
  );
}

export default BatteryHalfMedium;
