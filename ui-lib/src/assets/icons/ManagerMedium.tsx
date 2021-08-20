import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ManagerMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.56014 19.5359V14.8559H9.12014V19.5359H4.56014ZM2.64014 21.3599H11.0401V13.0559H2.64014V21.3599ZM2.64014 10.9199H11.0401V2.63989H2.64014V10.9199ZM4.56014 9.11989V4.43989H9.12014V9.11989H4.56014ZM12.9601 21.3599H21.3601V13.0559H12.9601V21.3599ZM12.9601 10.9199H21.3601V2.63989H12.9601V10.9199ZM14.8801 19.5359V14.8559H19.4401V19.5359H14.8801ZM14.8801 9.11989V4.43989H19.4401V9.11989H14.8801Z"
        fill={color}
      />
    </svg>
  );
}

export default ManagerMedium;
