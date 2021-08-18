import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ServerThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.12012 21.36H10.3201V14.4H6.93612V12.24H17.0641V14.4H13.6801V21.36H20.8801V14.4H17.5441V11.76H12.2401V9.60002H15.6001V2.64001H8.40012V9.60002H11.7601V11.76H6.45612V14.4H3.12012V21.36ZM3.60012 20.88V14.88H9.84012V20.88H3.60012ZM8.88012 9.12002V3.12001H15.1201V9.12002H8.88012ZM14.1601 20.88V14.88H20.4001V20.88H14.1601Z"
        fill={color}
      />
    </svg>
  );
}

export default ServerThin;
