import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function WarningMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.68018 21.3599H22.3202L12.0002 2.63989L1.68018 21.3599ZM4.82418 19.5599L12.0002 6.55189L19.1762 19.5599H4.82418ZM10.8482 18.2399H13.1042V15.9839H10.8482V18.2399ZM11.0162 12.2639L11.2322 14.6159H12.7442L12.9842 12.2639V10.3679H11.0162V12.2639Z"
        fill={color}
      />
    </svg>
  );
}

export default WarningMedium;
