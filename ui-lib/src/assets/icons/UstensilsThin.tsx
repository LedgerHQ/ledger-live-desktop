import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function UstensilsThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.76381 11.52V21.84H8.24381V11.52C10.1398 11.376 11.6038 9.792 11.6038 7.92V2.4H11.1238V7.92C11.1238 9.576 9.89981 10.92 8.24381 11.04V2.4H7.76381V11.04C6.13181 10.92 4.88381 9.576 4.88381 7.92V2.4H4.40381V7.92C4.40381 9.792 5.89181 11.376 7.76381 11.52ZM14.3158 16.8H19.1158V21.84H19.5958V2.16C16.6678 2.16 14.3158 4.488 14.3158 7.44V16.8ZM14.7958 16.32V7.44C14.7958 4.848 16.6198 2.88 19.1158 2.664V16.32H14.7958Z"
        fill={color}
      />
    </svg>
  );
}

export default UstensilsThin;
