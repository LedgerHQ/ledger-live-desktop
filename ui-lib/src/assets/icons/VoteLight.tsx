import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function VoteLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.2002 21.36H19.8002V2.64001H9.5522L4.2002 7.99201V21.36ZM5.4002 20.208V8.68801H10.3202V3.76801H18.6002V20.208H5.4002ZM7.9442 12.048L11.1842 15.312L16.7522 9.74402L15.9122 8.90402L11.1842 13.608L8.78419 11.208L7.9442 12.048Z"
        fill={color}
      />
    </svg>
  );
}

export default VoteLight;
