import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function TwoCircledInitLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.26 16.464H16.38V15.384L11.628 15.408V15L14.268 13.2C15.804 12.144 16.38 11.256 16.38 10.128C16.38 8.35201 14.964 7.34401 13.26 7.34401C11.292 7.34401 10.044 8.688 10.044 10.2V10.464H11.244V10.224C11.244 9.12001 11.82 8.42401 13.188 8.42401H13.308C14.484 8.42401 15.18 8.952 15.18 10.152C15.18 10.992 14.868 11.568 13.284 12.648L10.26 14.736V16.464ZM4.11597 12C4.11597 17.088 8.14797 21.12 13.236 21.12H19.884V19.92H13.236C8.79597 19.92 5.31597 16.44 5.31597 12C5.31597 7.68001 8.79597 4.08 13.236 4.08H19.884V2.88H13.236C8.12397 2.88 4.11597 7.032 4.11597 12Z"
        fill={color}
      />
    </svg>
  );
}

export default TwoCircledInitLight;
