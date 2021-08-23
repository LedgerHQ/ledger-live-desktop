import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function SevenCircledInitLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.628 16.44H12.996C13.308 13.296 14.484 10.752 16.524 8.856V7.584H9.94797V8.64001H15.132V8.97601C13.116 11.088 11.964 13.584 11.628 16.44ZM4.11597 12C4.11597 17.088 8.14797 21.12 13.236 21.12H19.884V19.92H13.236C8.79597 19.92 5.31597 16.44 5.31597 12C5.31597 7.68001 8.79597 4.08 13.236 4.08H19.884V2.88H13.236C8.12397 2.88 4.11597 7.032 4.11597 12Z"
        fill={color}
      />
    </svg>
  );
}

export default SevenCircledInitLight;
