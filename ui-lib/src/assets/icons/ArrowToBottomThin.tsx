import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ArrowToBottomThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.0001 17.28L17.4961 11.784L17.1601 11.448L14.9281 13.68L12.2401 16.368V3.35999H11.7601V16.368L9.0721 13.68L6.8401 11.448L6.5041 11.784L12.0001 17.28ZM3.6001 20.64H20.4001V20.16H3.6001V20.64Z"
        fill={color}
      />
    </svg>
  );
}

export default ArrowToBottomThin;
