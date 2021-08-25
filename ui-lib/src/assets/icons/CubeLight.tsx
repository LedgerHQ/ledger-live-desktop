import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function CubeLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.9999 22.152L20.8079 17.016V6.98402L11.9999 1.84802L3.19189 6.98402V17.016L11.9999 22.152ZM4.39189 16.392V8.28002L11.4239 12.336V20.472L4.39189 16.392ZM4.94389 7.29602L11.9999 3.19202L19.0559 7.29602L11.9999 11.352L4.94389 7.29602ZM12.5759 20.472V12.336L19.6079 8.28002V16.392L12.5759 20.472Z"
        fill={color}
      />
    </svg>
  );
}

export default CubeLight;
