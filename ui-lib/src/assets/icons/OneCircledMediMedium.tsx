import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function OneCircledMediMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.88 13.5359V16.4639H13.8V7.58389H11.568L8.78401 10.1519V12.4079L11.616 9.81589H11.952C11.952 9.81589 11.88 11.3999 11.88 13.5359ZM5.76001 21.3599H18.24V19.4399H5.76001V21.3599ZM5.76001 4.55989H18.24V2.63989H5.76001V4.55989Z"
        fill={color}
      />
    </svg>
  );
}

export default OneCircledMediMedium;
