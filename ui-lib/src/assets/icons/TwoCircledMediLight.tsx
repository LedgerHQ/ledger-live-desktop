import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function TwoCircledMediLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.02401 16.464H15.144V15.384L10.392 15.408V15L13.032 13.2C14.568 12.144 15.144 11.256 15.144 10.128C15.144 8.35201 13.728 7.34401 12.024 7.34401C10.056 7.34401 8.80801 8.664 8.80801 10.2V10.464H10.008V10.224C10.008 9.12001 10.584 8.42401 11.952 8.42401H12.072C13.248 8.42401 13.944 8.952 13.944 10.152C13.944 10.968 13.632 11.568 12.048 12.648L9.02401 14.736V16.464ZM5.76001 21.12H18.24V19.92H5.76001V21.12ZM5.76001 4.08H18.24V2.88H5.76001V4.08Z"
        fill={color}
      />
    </svg>
  );
}

export default TwoCircledMediLight;
