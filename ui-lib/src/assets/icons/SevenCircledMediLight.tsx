import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function SevenCircledMediLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.208 16.44H12.576C12.888 13.296 14.064 10.752 16.104 8.856V7.584H9.52801V8.64001H14.712V8.97601C12.696 11.088 11.544 13.584 11.208 16.44ZM5.76001 21.12H18.24V19.92H5.76001V21.12ZM5.76001 4.08H18.24V2.88H5.76001V4.08Z"
        fill={color}
      />
    </svg>
  );
}

export default SevenCircledMediLight;
