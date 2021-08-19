import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function FourCircledMediLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.504 12.024V13.464H9.28801L12.336 8.88H12.528C12.504 9.86401 12.504 10.968 12.504 12.024ZM5.76001 21.12H18.24V19.92H5.76001V21.12ZM5.76001 4.08H18.24V2.88H5.76001V4.08ZM8.13601 14.496H12.504V16.464H13.632V14.496H15.072V13.464H13.632V7.584H12.096L8.13601 13.512V14.496Z"
        fill={color}
      />
    </svg>
  );
}

export default FourCircledMediLight;
