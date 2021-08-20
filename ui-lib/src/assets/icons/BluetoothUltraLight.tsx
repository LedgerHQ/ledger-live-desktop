import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function BluetoothUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.0002 22.32C17.4242 22.32 19.8962 19.128 19.9442 12C19.8962 4.872 17.4242 1.68 12.0002 1.68C6.57615 1.68 4.10415 4.872 4.05615 12C4.10415 19.128 6.57615 22.32 12.0002 22.32ZM7.53615 15.768L11.2802 12L7.53615 8.232L8.54415 7.224L11.5202 10.296V3.096L16.7282 8.472L13.2002 12L16.7282 15.528L11.5202 20.904V13.704L8.54415 16.776L7.53615 15.768ZM12.9362 17.352L14.6882 15.528L12.9362 13.704V17.352ZM12.9362 10.296L14.6882 8.472L12.9362 6.648V10.296Z"
        fill={color}
      />
    </svg>
  );
}

export default BluetoothUltraLight;
