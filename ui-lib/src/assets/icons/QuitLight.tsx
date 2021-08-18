import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function QuitLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.71978 21.6H21.7198V2.40002H9.71978V7.68002H10.9198V3.60002H20.5198V20.4H10.9198V16.32H9.71978V21.6ZM2.27979 12L6.62379 16.344L7.39178 15.576L5.92778 14.112C5.42378 13.608 4.87178 13.08 4.34379 12.576H15.7198V11.424H4.31979C4.87178 10.896 5.39979 10.392 5.92778 9.86402L7.39178 8.40002L6.62379 7.63202L2.27979 12Z"
        fill={color}
      />
    </svg>
  );
}

export default QuitLight;
