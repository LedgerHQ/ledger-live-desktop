import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function VoteThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.31982 21.36H19.6798V2.64001H9.67182L4.31982 7.99201V21.36ZM4.79982 20.88V8.66402H10.3438V3.12001H19.1998V20.88H4.79982ZM4.79982 8.18402L9.86382 3.12001V8.18402H4.79982ZM8.06382 11.952L11.1838 15.072L16.6318 9.62402L16.2958 9.28802L11.1838 14.4L8.39982 11.616L8.06382 11.952Z"
        fill={color}
      />
    </svg>
  );
}

export default VoteThin;
