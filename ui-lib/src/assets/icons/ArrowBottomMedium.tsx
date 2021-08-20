import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ArrowBottomMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 21.3719L18.624 14.7239L17.448 13.5239L14.088 16.9079C13.704 17.2919 13.296 17.7239 12.912 18.1559V2.62793H11.088V18.1559C10.704 17.7239 10.296 17.2919 9.91198 16.9079L6.55198 13.5239L5.37598 14.7239L12 21.3719Z"
        fill={color}
      />
    </svg>
  );
}

export default ArrowBottomMedium;
