import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function BarChartLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.5841 20.88H21.3601V3.12H16.5841V20.88ZM2.64014 20.88H7.41614V7.368H2.64014V20.88ZM3.72014 19.8V8.448H6.33614V19.8H3.72014ZM9.60014 20.88H14.4001V10.824H9.60014V20.88ZM10.6801 19.8V11.904H13.3201V19.8H10.6801ZM17.6641 19.8V4.2H20.2801V19.8H17.6641Z"
        fill={color}
      />
    </svg>
  );
}

export default BarChartLight;
