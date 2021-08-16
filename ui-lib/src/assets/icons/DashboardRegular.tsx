import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function DashboardRegular({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.87988 20.2681H21.1199V18.7321H4.43988V4.42806H2.87988V20.2681ZM6.91188 16.5721H8.54388V10.9321H6.91188V16.5721ZM11.0159 16.5721H12.6719V6.10806H11.0159V16.5721ZM15.1439 16.5721H16.7759V8.50806H15.1439V16.5721ZM19.2479 16.5721H20.9039V3.73206H19.2479V16.5721Z"
        fill={color}
      />
    </svg>
  );
}

export default DashboardRegular;
