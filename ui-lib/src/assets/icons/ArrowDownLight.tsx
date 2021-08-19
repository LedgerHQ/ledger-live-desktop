import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ArrowDownLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.9202 20.28H20.2802V10.896H19.2242V15.528C19.2242 16.464 19.2242 17.448 19.2482 18.432L4.53621 3.71997L3.72021 4.53597L18.4322 19.224C17.4722 19.224 16.4882 19.2 15.5282 19.2H10.8962L10.9202 20.28Z"
        fill={color}
      />
    </svg>
  );
}

export default ArrowDownLight;
