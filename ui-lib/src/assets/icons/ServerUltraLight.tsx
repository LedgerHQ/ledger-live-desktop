import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ServerUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.12012 21.36H10.3201V14.4H7.10412V12.384H16.9201V14.4H13.6801V21.36H20.8801V14.4H17.6881V11.616H12.3841V9.6H15.6001V2.64H8.40012V9.6H11.6161V11.616H6.31212V14.4H3.12012V21.36ZM3.93612 20.592V15.168H9.50412V20.592H3.93612ZM9.21612 8.808V3.408H14.7841V8.808H9.21612ZM14.4961 20.592V15.168H20.0641V20.592H14.4961Z"
        fill={color}
      />
    </svg>
  );
}

export default ServerUltraLight;
