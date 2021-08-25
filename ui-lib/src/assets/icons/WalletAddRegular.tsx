import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function WalletAddRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.0602 19.7401H21.3002V6.66005H6.4202V8.12405H19.7402V18.2761H12.0602V19.7401ZM2.7002 17.4841H6.0362V20.8201H7.5242V17.4841H10.8602V15.9961H7.5242V12.6601H6.0362V15.9961H2.7002V17.4841ZM2.8202 11.5801H4.2842V5.10005C4.2842 4.78805 4.4282 4.64405 4.7402 4.64405H19.3562C19.2362 3.78005 18.4922 3.18005 17.5802 3.18005H4.7402C3.6362 3.18005 2.8202 3.99605 2.8202 5.10005V11.5801ZM15.2282 13.3081C15.2282 13.9321 15.7322 14.4841 16.3802 14.4841C17.0282 14.4841 17.5322 13.9321 17.5322 13.3081C17.5322 12.6841 17.0282 12.1801 16.3802 12.1801C15.7322 12.1801 15.2282 12.6841 15.2282 13.3081Z"
        fill={color}
      />
    </svg>
  );
}

export default WalletAddRegular;
