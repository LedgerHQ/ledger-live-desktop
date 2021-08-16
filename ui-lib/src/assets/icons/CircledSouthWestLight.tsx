import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function CircledSouthWestLight({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.20788 15.792H14.3519V14.712H12.4079C11.6399 14.712 10.8719 14.712 10.0799 14.736L15.9359 8.90401L15.0959 8.064L9.26388 13.92C9.26388 13.128 9.28788 12.36 9.28788 11.592V9.624H8.20788V15.792ZM2.87988 12C2.87988 17.088 6.91188 21.12 11.9999 21.12C17.1119 21.12 21.1199 16.968 21.1199 12C21.1199 6.912 17.0879 2.88 11.9999 2.88C6.91188 2.88 2.87988 6.912 2.87988 12ZM4.07988 12C4.07988 7.56 7.55988 4.08 11.9999 4.08C16.4399 4.08 19.9199 7.56 19.9199 12C19.9199 16.32 16.4399 19.92 11.9999 19.92C7.55988 19.92 4.07988 16.44 4.07988 12Z"
        fill={color}
      />
    </svg>
  );
}

export default CircledSouthWestLight;
