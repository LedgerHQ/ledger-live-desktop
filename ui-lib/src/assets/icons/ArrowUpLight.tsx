import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ArrowUpLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.53621 20.28L19.2482 5.56797C19.2242 6.52797 19.2242 7.51197 19.2242 8.47197V13.104L20.2802 13.08V3.71997H10.9202L10.8962 4.77597H15.5282C16.4882 4.77597 17.4722 4.77597 18.4322 4.75197L3.72021 19.464L4.53621 20.28Z"
        fill={color}
      />
    </svg>
  );
}

export default ArrowUpLight;
