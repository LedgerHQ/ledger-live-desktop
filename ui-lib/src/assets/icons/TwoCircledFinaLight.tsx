import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function TwoCircledFinaLight({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.78797 16.464H13.908V15.384L9.15597 15.408V15L11.796 13.2C13.332 12.144 13.908 11.256 13.908 10.128C13.908 8.35201 12.492 7.34401 10.788 7.34401C8.81997 7.34401 7.57197 8.664 7.57197 10.2V10.464H8.77197V10.224C8.77197 9.12001 9.34797 8.42401 10.716 8.42401H10.836C12.012 8.42401 12.708 8.952 12.708 10.152C12.708 10.968 12.396 11.568 10.812 12.648L7.78797 14.736V16.464ZM4.11597 21.12H10.764C15.876 21.12 19.884 16.968 19.884 12C19.884 6.888 15.876 2.88 10.764 2.88H4.11597V4.08H10.764C15.204 4.08 18.684 7.56 18.684 12C18.684 16.32 15.204 19.92 10.764 19.92H4.11597V21.12Z"
        fill={color}
      />
    </svg>
  );
}

export default TwoCircledFinaLight;
