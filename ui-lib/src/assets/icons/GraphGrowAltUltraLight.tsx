import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function GraphGrowAltUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.52002 20.232H21.24V19.392H3.36002V4.392H2.52002V20.232ZM4.87202 15.168L10.08 9.984L12.96 12.864L20.712 5.112V8.016V9.936H21.48V3.768H15.336V4.536H17.232H20.136L12.96 11.712L10.08 8.832L4.87202 14.016V15.168Z"
        fill={color}
      />
    </svg>
  );
}

export default GraphGrowAltUltraLight;
