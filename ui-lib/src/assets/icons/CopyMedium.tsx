import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function CopyMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.5199 15.5999H21.3599V2.63989L8.39989 2.66389V6.47989H10.3199V4.46389L19.4399 4.43989V13.7999H17.5199V15.5999ZM2.63989 21.3599H15.5999V8.39989H2.63989V21.3599ZM4.55989 19.5599V10.1999H13.6799V19.5599H4.55989Z"
        fill={color}
      />
    </svg>
  );
}

export default CopyMedium;
