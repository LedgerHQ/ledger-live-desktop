import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function ShareRegular({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.71997 20.58H20.28V11.46H16.32V13.02H18.72V19.02H5.27997V13.02H7.67997V11.46H3.71997V20.58ZM7.65597 7.76404L8.63997 8.72404L9.91197 7.47604C10.344 7.02004 10.824 6.54004 11.256 6.06004V16.38H12.744V6.01204C13.2 6.51604 13.656 6.99604 14.112 7.47604L15.408 8.72404L16.368 7.76404L12 3.42004L7.65597 7.76404Z"
        fill={color}
      />
    </svg>
  );
}

export default ShareRegular;
