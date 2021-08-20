import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function LendThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.36011 14.16V14.64C10.1521 13.68 15.8161 9.648 20.1601 3.936V7.248V9.288H20.6401V3.12H14.4961V3.6H16.5361H19.8001C15.5281 9.24 10.0321 13.2 3.36011 14.16ZM3.36011 20.88H3.84011V17.952H3.36011V20.88ZM7.56011 20.88H8.04011V16.608H7.56011V20.88ZM11.7601 20.88H12.2401V15.192H11.7601V20.88ZM15.9601 20.88H16.4401V13.824H15.9601V20.88ZM20.1601 20.88H20.6401V12.48H20.1601V20.88Z"
        fill={color}
      />
    </svg>
  );
}

export default LendThin;
