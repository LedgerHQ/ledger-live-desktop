import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function BuyCryptoRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.63993 12H4.12793V6.83995H19.7279C19.2239 7.29595 18.7439 7.75195 18.2639 8.20795L17.0159 9.47995L17.9759 10.464L22.3199 6.09595L17.9759 1.75195L17.0159 2.73595L18.2639 3.98395C18.7199 4.43995 19.1999 4.89595 19.6799 5.35195H2.63993V12ZM1.67993 17.904L6.02393 22.248L6.98393 21.264L5.73593 19.992C5.27993 19.56 4.79993 19.08 4.31993 18.648H21.3599V12H19.8719V17.16H4.29593C4.77593 16.704 5.27993 16.248 5.73593 15.792L6.98393 14.496L6.02393 13.536L1.67993 17.904Z"
        fill={color}
      />
    </svg>
  );
}

export default BuyCryptoRegular;
