import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function RedelegateThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.64018 8.18401V12H3.12018V8.18401C3.12018 7.32001 4.05618 6.33601 4.96818 6.33601H21.4082L19.5122 8.23201L17.6402 10.104L17.9762 10.44L22.3202 6.09601L17.9762 1.75201L17.6402 2.08801L19.5122 3.96001L21.4082 5.85601H4.96818C3.81618 5.85601 2.64018 7.08001 2.64018 8.18401ZM1.68018 17.904L6.02418 22.248L6.36018 21.912L4.48818 20.04L2.59218 18.144H19.0322C20.1842 18.144 21.3602 16.92 21.3602 15.816V12H20.8802V15.816C20.8802 16.68 19.9442 17.664 19.0322 17.664H2.59218L4.48818 15.768L6.36018 13.896L6.02418 13.56L1.68018 17.904Z"
        fill={color}
      />
    </svg>
  );
}

export default RedelegateThin;
