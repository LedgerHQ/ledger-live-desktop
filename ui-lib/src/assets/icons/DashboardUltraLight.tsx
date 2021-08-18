import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function DashboardUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.36011 19.992H20.6401V19.152H4.20011V4.152H3.36011V19.992ZM7.15211 16.848H8.01611V11.208H7.15211V16.848ZM11.1361 16.848H12.0241V6.384H11.1361V16.848ZM15.1441 16.848H16.0081V8.784H15.1441V16.848ZM19.1281 16.848H20.0161V4.008H19.1281V16.848Z"
        fill={color}
      />
    </svg>
  );
}

export default DashboardUltraLight;
