import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function LedgerBlueUltraLight({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.57991 21.96H17.8199C18.9239 21.96 19.7399 21.144 19.7399 20.04V8.4H20.3399V5.04H19.7399V3.96C19.7399 2.856 18.9239 2.04 17.8199 2.04H5.57991C4.47591 2.04 3.65991 2.856 3.65991 3.96V20.04C3.65991 21.144 4.47591 21.96 5.57991 21.96ZM4.47591 20.064V3.936C4.47591 3.24 4.88391 2.856 5.55591 2.856H17.8439C18.5399 2.856 18.9239 3.24 18.9239 3.936V20.064C18.9239 20.76 18.5399 21.144 17.8439 21.144H5.55591C4.88391 21.144 4.47591 20.76 4.47591 20.064ZM6.29991 19.32H17.0999V4.68H6.29991V19.32ZM7.04391 18.576V5.424H16.3559V18.576H7.04391Z"
        fill={color}
      />
    </svg>
  );
}

export default LedgerBlueUltraLight;
