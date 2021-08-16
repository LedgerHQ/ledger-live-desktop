import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function BandwithLight({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.7039 20.4H20.9759V3.59998H19.7039V20.4ZM3.02393 20.4H4.29593V16.152H3.02393V20.4ZM7.19993 20.4H8.44793V13.008H7.19993V20.4ZM11.3759 20.4H12.6239V9.86398H11.3759V20.4ZM15.5519 20.4H16.7999V6.71998H15.5519V20.4Z"
        fill={color}
      />
    </svg>
  );
}

export default BandwithLight;
