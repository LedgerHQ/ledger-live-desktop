import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function HouseThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.32018 21.36H10.4402V14.04H13.5602V21.36H19.6802V10.248L22.0082 12.36L22.3202 12L12.0002 2.64001L1.68018 12L1.99218 12.36L4.32018 10.248V21.36ZM4.80018 20.88V9.81602L12.0002 3.28801L19.2002 9.81602V20.88H14.0402V13.56H9.96018V20.88H4.80018Z"
        fill={color}
      />
    </svg>
  );
}

export default HouseThin;
