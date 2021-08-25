import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function WalletUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.92 20.04H21V7.19999H6.36V8.01599H20.184V19.224H4.92C4.2 19.224 3.816 18.84 3.816 18.12V5.87999C3.816 5.15999 4.2 4.77599 4.92 4.77599H18.984C18.72 4.27199 18.168 3.95999 17.52 3.95999H4.92C3.816 3.95999 3 4.77599 3 5.87999V18.12C3 19.224 3.816 20.04 4.92 20.04ZM15.384 13.728C15.384 14.232 15.792 14.688 16.344 14.688C16.848 14.688 17.256 14.232 17.256 13.728C17.256 13.224 16.848 12.792 16.344 12.792C15.792 12.792 15.384 13.224 15.384 13.728Z"
        fill={color}
      />
    </svg>
  );
}

export default WalletUltraLight;
