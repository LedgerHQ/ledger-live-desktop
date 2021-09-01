import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function VoteUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.25977 21.36H19.7398V2.64001H9.61177L4.25977 7.99201V21.36ZM5.09977 20.544V8.66402H10.3078V3.45601H18.8998V20.544H5.09977ZM5.41177 7.92002L9.56377 3.76801V7.92002H5.41177ZM8.00377 12L11.1718 15.192L16.6678 9.67202L16.0918 9.09601L11.1718 13.992L8.57977 11.424L8.00377 12Z"
        fill={color}
      />
    </svg>
  );
}

export default VoteUltraLight;
