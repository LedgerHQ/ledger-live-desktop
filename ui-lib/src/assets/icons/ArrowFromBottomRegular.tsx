import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ArrowFromBottomRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.2561 5.57994V16.8599H12.7441V5.55594C13.2481 6.10794 13.8001 6.65994 14.3041 7.18794L16.5361 9.39594L17.4961 8.43594L12.0001 2.93994L6.5041 8.43594L7.4881 9.39594L9.6961 7.18794C10.2241 6.68394 10.7521 6.13194 11.2561 5.57994ZM3.6001 21.0599H20.4001V19.4999H3.6001V21.0599Z"
        fill={color}
      />
    </svg>
  );
}

export default ArrowFromBottomRegular;
