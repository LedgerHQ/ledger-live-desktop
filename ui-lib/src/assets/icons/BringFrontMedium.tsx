import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function BringFrontMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.4799 21.3599H21.3599V12.4799H18.3599V14.2799H19.5599V19.5599H14.2799V18.3599H12.4799V21.3599ZM2.63989 11.5199H5.63989V9.71989H4.43989V4.43989H9.71989V5.63989H11.5199V2.63989H2.63989V11.5199ZM7.55989 16.4399H16.4399V7.55989H7.55989V16.4399ZM9.35989 14.6399V9.35989H14.6399V14.6399H9.35989Z"
        fill={color}
      />
    </svg>
  );
}

export default BringFrontMedium;
