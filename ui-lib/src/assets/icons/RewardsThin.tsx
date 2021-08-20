import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function RewardsThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.30414 17.688H18.6961V17.208H16.1761C18.3841 15.792 19.8001 13.392 19.8001 10.68C19.8001 6.384 16.2961 2.88 12.0001 2.88C7.70414 2.88 4.20014 6.384 4.20014 10.68C4.20014 13.392 5.59214 15.792 7.80014 17.208H5.30414V17.688ZM2.64014 21.12H21.3601V15H20.8801V20.64H3.12014V15H2.64014V21.12ZM4.68014 10.68C4.68014 6.624 7.94414 3.36 12.0001 3.36C16.0561 3.36 19.3201 6.624 19.3201 10.68C19.3201 13.536 17.6881 16.008 15.3121 17.208H8.68814C6.31214 16.008 4.68014 13.536 4.68014 10.68Z"
        fill={color}
      />
    </svg>
  );
}

export default RewardsThin;
