import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function PowerLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.2481 22.344L19.6081 9.60001H13.1521L13.7281 1.65601L4.39209 14.4H10.8241L10.2481 22.344ZM6.60009 13.32L12.4561 5.23201L12.0001 10.68H17.4001L11.5441 18.768L12.0001 13.32H6.60009Z"
        fill={color}
      />
    </svg>
  );
}

export default PowerLight;
