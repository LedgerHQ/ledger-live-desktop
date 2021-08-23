import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function QuitMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.36016 21.8399H21.8402V2.15991H9.36016V7.67991H11.2802V4.07991H19.9202V19.9199H11.2802V16.3199H9.36016V21.8399ZM2.16016 11.9999L6.50416 16.3439L7.68016 15.1439L6.62416 14.0879C6.24016 13.7039 5.80816 13.2959 5.37616 12.9119H15.6002V11.0879H5.32816C5.78416 10.6799 6.21616 10.2959 6.62416 9.88791L7.68016 8.80791L6.50416 7.63191L2.16016 11.9999Z"
        fill={color}
      />
    </svg>
  );
}

export default QuitMedium;
