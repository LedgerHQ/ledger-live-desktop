import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function CoinLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.608 22.08H13.488C17.232 22.08 20.064 17.448 20.064 12C20.064 6.55198 17.232 1.91998 13.488 1.91998H10.608C6.74404 1.91998 3.93604 6.57598 3.93604 12C3.93604 17.424 6.74404 22.08 10.608 22.08ZM5.13604 12C5.13604 7.10398 7.58404 3.11998 10.608 3.11998C13.536 3.11998 16.032 7.10398 16.032 12C16.032 16.896 13.536 20.88 10.608 20.88C7.58404 20.88 5.13604 16.896 5.13604 12ZM13.488 20.88C15.6 19.248 17.04 15.84 17.04 12C17.04 8.15998 15.6 4.75198 13.488 3.11998C16.44 3.11998 18.864 7.10398 18.864 12C18.864 16.896 16.44 20.88 13.488 20.88Z"
        fill={color}
      />
    </svg>
  );
}

export default CoinLight;
