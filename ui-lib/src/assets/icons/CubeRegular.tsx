import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function CubeRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.9879 22.248L20.8919 17.064V6.93595L11.9879 1.75195L3.10791 6.93595V17.064L11.9879 22.248ZM4.66791 16.224V8.63995L11.2439 12.432V20.088L4.66791 16.224ZM5.36391 7.34395L11.9879 3.50395L18.6119 7.34395L11.9879 11.16L5.36391 7.34395ZM12.7319 20.088V12.432L19.3319 8.63995V16.224L12.7319 20.088Z"
        fill={color}
      />
    </svg>
  );
}

export default CubeRegular;
