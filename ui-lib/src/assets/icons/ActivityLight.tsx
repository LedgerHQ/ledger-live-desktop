import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ActivityLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.14795 12.648H6.41995L8.98795 4.92L14.9639 22.896L18.4199 12.648H21.8519V11.376H17.5799L14.9879 19.08L8.98795 1.104L5.55595 11.376H2.14795V12.648Z"
        fill={color}
      />
    </svg>
  );
}

export default ActivityLight;
