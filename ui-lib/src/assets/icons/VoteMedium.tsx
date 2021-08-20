import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function VoteMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.08008 21.3599H19.9201V2.63989H9.43208L4.08008 7.99189V21.3599ZM6.00008 19.5599V8.71189H10.2721V4.43989H18.0001V19.5599H6.00008ZM7.82408 12.1679L11.1841 15.5519L16.8481 9.86389L15.5041 8.51989L11.1841 12.8159L9.16808 10.8239L7.82408 12.1679Z"
        fill={color}
      />
    </svg>
  );
}

export default VoteMedium;
