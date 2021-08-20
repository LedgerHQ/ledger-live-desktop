import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function BarChartThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.5841 20.88H20.8801V3.12H16.5841V20.88ZM3.12012 20.88H7.41612V7.368H3.12012V20.88ZM3.60012 20.4V7.848H6.93612V20.4H3.60012ZM9.84012 20.88H14.1601V10.824H9.84012V20.88ZM10.3201 20.4V11.304H13.6801V20.4H10.3201ZM17.0641 20.4V3.6H20.4001V20.4H17.0641Z"
        fill={color}
      />
    </svg>
  );
}

export default BarChartThin;
