import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function GooglePlayMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.3921 21.2879L13.7281 11.9999L4.3921 2.71191C3.8641 2.99991 3.6001 3.40791 3.6001 3.98391V20.0399C3.6001 20.6159 3.8641 21.0239 4.3921 21.2879ZM6.5521 20.8559L16.6321 15.0239L14.4721 12.8159L6.5521 20.8559ZM6.5521 3.16791L14.4721 11.2079L16.6321 9.04791L6.5521 3.16791ZM15.3121 11.9999L17.6641 14.3519L19.8001 13.1279C20.1841 12.9119 20.4001 12.4559 20.4001 12.0239C20.4001 11.5919 20.1841 11.1359 19.8001 10.9439L17.6641 9.69591L15.3121 11.9999Z"
        fill={color}
      />
    </svg>
  );
}

export default GooglePlayMedium;
