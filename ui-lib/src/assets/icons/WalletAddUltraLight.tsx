import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function WalletAddUltraLight({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.1798 19.38H21.1798V6.53999H6.53982V7.35599H20.3398V18.564H12.1798V19.38ZM2.81982 17.028H6.49182V20.7H7.30782V17.028H10.9798V16.212H7.30782V12.54H6.49182V16.212H2.81982V17.028ZM3.17982 11.7H3.99582V5.21999C3.99582 4.49999 4.37982 4.11599 5.09982 4.11599H19.1638C18.8998 3.61199 18.3478 3.29999 17.6998 3.29999H5.09982C3.99582 3.29999 3.17982 4.11599 3.17982 5.21999V11.7ZM15.5638 13.068C15.5638 13.572 15.9718 14.028 16.5238 14.028C17.0278 14.028 17.4358 13.572 17.4358 13.068C17.4358 12.564 17.0278 12.132 16.5238 12.132C15.9718 12.132 15.5638 12.564 15.5638 13.068Z"
        fill={color}
      />
    </svg>
  );
}

export default WalletAddUltraLight;
