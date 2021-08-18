import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function CubeThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.0001 21.984L20.6401 16.968V7.03199L12.0001 2.01599L3.36011 7.03199V16.968L12.0001 21.984ZM3.84011 16.68V7.58399L11.7601 12.144V21.288L3.84011 16.68ZM4.08011 7.17599L12.0001 2.59199L19.9201 7.17599L12.0001 11.712L4.08011 7.17599ZM12.2401 21.288V12.144L20.1601 7.58399V16.68L12.2401 21.288Z"
        fill={color}
      />
    </svg>
  );
}

export default CubeThin;
