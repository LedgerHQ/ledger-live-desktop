import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ComputerUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.30389 20.4H18.7199C18.4319 19.944 17.9039 19.608 17.2799 19.608H14.7119L14.0159 16.32H19.5599C20.5439 16.32 21.3599 15.504 21.3599 14.52V5.4C21.3599 4.416 20.5439 3.6 19.5599 3.6H4.43989C3.45589 3.6 2.63989 4.416 2.63989 5.4V14.52C2.63989 15.504 3.45589 16.32 4.43989 16.32H9.98389L9.28789 19.608H6.71989C6.11989 19.608 5.56789 19.944 5.30389 20.4ZM3.47989 14.496V5.4C3.47989 4.8 3.88789 4.416 4.48789 4.416H19.5119C20.1119 4.416 20.5199 4.8 20.5199 5.4V14.496C20.5199 15.096 20.1119 15.504 19.5119 15.504H4.48789C3.88789 15.504 3.47989 15.096 3.47989 14.496ZM10.0799 19.608L10.7759 16.32H13.2239L13.9199 19.608H10.0799Z"
        fill={color}
      />
    </svg>
  );
}

export default ComputerUltraLight;
