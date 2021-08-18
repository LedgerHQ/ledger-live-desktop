import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ArrowUpThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.17584 20.16L19.7038 4.63203V8.71203V13.2H20.1598V3.84003H10.7998V4.29603H15.2878H19.3678L3.83984 19.824L4.17584 20.16Z"
        fill={color}
      />
    </svg>
  );
}

export default ArrowUpThin;
