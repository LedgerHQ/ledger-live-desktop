import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ShoppingBasketRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.71997 20.8201H20.28V9.06005H16.8V8.10005C16.8 6.70805 16.512 5.72405 15.912 4.95605C15 3.80405 13.512 3.18005 12 3.18005C10.488 3.18005 8.99997 3.80405 8.08797 4.95605C7.48797 5.74805 7.19997 6.73205 7.19997 8.10005V9.06005H3.71997V20.8201ZM5.27997 19.3561V10.5241H7.19997V12.9721H8.75997V10.5241H15.24V12.9721H16.8V10.5241H18.72V19.3561H5.27997ZM8.75997 9.06005V7.35605C8.75997 5.60405 9.67197 4.69205 11.52 4.69205H12.504C14.304 4.69205 15.24 5.60405 15.24 7.35605V9.06005H8.75997Z"
        fill={color}
      />
    </svg>
  );
}

export default ShoppingBasketRegular;
