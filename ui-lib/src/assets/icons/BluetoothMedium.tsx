import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function BluetoothMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.0002 22.3199C17.4242 22.3199 19.8962 19.1279 19.9442 11.9999C19.8962 4.87193 17.4242 1.67993 12.0002 1.67993C6.57615 1.67993 4.10415 4.87193 4.05615 11.9999C4.10415 19.1279 6.57615 22.3199 12.0002 22.3199ZM7.53615 15.7679L11.2802 11.9999L7.53615 8.23193L8.54415 7.22393L11.5202 10.2959V3.09593L16.7282 8.47193L13.2002 11.9999L16.7282 15.5279L11.5202 20.9039V13.7039L8.54415 16.7759L7.53615 15.7679ZM12.9362 17.3519L14.6882 15.5279L12.9362 13.7039V17.3519ZM12.9362 10.2959L14.6882 8.47193L12.9362 6.64793V10.2959Z"
        fill={color}
      />
    </svg>
  );
}

export default BluetoothMedium;
