import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function ShoppingBasketLight({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.84009 20.772H20.1601V9.25203H16.8001V8.07603C16.8001 6.80403 16.5121 5.84403 15.9121 5.07603C15.0001 3.90003 13.5361 3.22803 12.0001 3.22803C10.4881 3.22803 9.00009 3.90003 8.11209 5.07603C7.51209 5.84403 7.20009 6.82803 7.20009 8.07603V9.25203H3.84009V20.772ZM5.04009 19.62V10.38H7.20009V12.972H8.40009V10.38H15.6001V12.972H16.8001V10.38H18.9601V19.62H5.04009ZM8.40009 9.25203V7.57203C8.40009 5.62803 9.64809 4.40403 11.6641 4.40403H12.3361C14.3521 4.40403 15.6001 5.62803 15.6001 7.57203V9.25203H8.40009Z"
        fill={color}
      />
    </svg>
  );
}

export default ShoppingBasketLight;
