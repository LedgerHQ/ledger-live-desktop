import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function TasksThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.40805 19.104H4.84805V17.664H3.40805V19.104ZM2.35205 11.736L4.15205 13.56L6.96005 10.752L6.62405 10.416L4.15205 12.888L2.68805 11.4L2.35205 11.736ZM2.35205 6.216L4.15205 8.04L6.96005 5.232L6.62405 4.896L4.15205 7.368L2.68805 5.88L2.35205 6.216ZM7.24805 18.624H21.6481V18.144H7.24805V18.624ZM8.68805 13.104H21.6481V12.624H8.68805V13.104ZM8.68805 7.584H21.6481V7.104H8.68805V7.584Z"
        fill={color}
      />
    </svg>
  );
}

export default TasksThin;
