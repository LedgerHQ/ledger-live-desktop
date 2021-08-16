import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function ArrowToBottomLight({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.0001 17.16L17.4961 11.664L16.7521 10.896L14.5201 13.128L12.5761 15.096V3.23999H11.4241V15.096C10.8001 14.424 10.1281 13.752 9.5041 13.128L7.2721 10.896L6.5041 11.664L12.0001 17.16ZM3.6001 20.76H20.4001V19.56H3.6001V20.76Z"
        fill={color}
      />
    </svg>
  );
}

export default ArrowToBottomLight;
