import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ShareMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.6001 20.6401H20.4001V11.2801H16.3201V13.2001H18.4801V18.7201H5.5201V13.2001H7.6801V11.2801H3.6001V20.6401ZM7.6561 7.70411L8.8561 8.88011L9.9121 7.82411C10.2961 7.44011 10.7041 7.00811 11.0881 6.57611V16.3201H12.9121V6.52811C13.3201 6.98411 13.7041 7.41611 14.1121 7.82411L15.1921 8.88011L16.3681 7.70411L12.0001 3.36011L7.6561 7.70411Z"
        fill={color}
      />
    </svg>
  );
}

export default ShareMedium;
