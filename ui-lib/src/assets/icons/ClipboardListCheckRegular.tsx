import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ClipboardListCheckRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.77979 21.6H20.2198V4.12802H15.8278V2.40002H8.14778V4.12802H3.77979V21.6ZM5.33979 20.112V5.59202H8.14778V5.80802H15.8278V5.59202H18.6598V20.112H5.33979ZM6.73179 9.62402L8.81978 11.736L11.9398 8.64002L11.0038 7.72802L8.84378 9.91202L7.66778 8.71202L6.73179 9.62402ZM7.73978 17.016H9.89978V14.856H7.73978V17.016ZM11.9398 16.728H16.7398V15.168H11.9398V16.728ZM13.0198 11.232H16.7398V9.67202H13.0198V11.232Z"
        fill={color}
      />
    </svg>
  );
}

export default ClipboardListCheckRegular;
