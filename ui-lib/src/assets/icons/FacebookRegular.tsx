import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function FacebookRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.5361 21.2999V14.772H8.13614V12.06H10.5361V9.97195C10.5361 7.71595 11.9281 6.34795 14.0881 6.34795C14.7601 6.34795 15.4321 6.41995 16.1521 6.53995V8.84395H14.9761C13.9681 8.84395 13.4881 9.29995 13.4881 10.284V12.06H16.1041L15.6481 14.772H13.4881V21.2999C17.9761 20.604 21.3601 16.6919 21.3601 12.06C21.3601 6.85195 17.1841 2.69995 12.0001 2.69995C6.79214 2.69995 2.64014 6.85195 2.64014 12.06C2.64014 16.6919 6.07214 20.604 10.5361 21.2999Z"
        fill={color}
      />
    </svg>
  );
}

export default FacebookRegular;
