import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ClipboardListCheckUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.14014 21.12H19.8601V4.416H15.8281V2.88H8.14814V4.416H4.14014V21.12ZM4.98014 20.304V5.232H8.14814V5.928H15.8281V5.232H19.0201V20.304H4.98014ZM6.80414 9.6L8.70014 11.52L11.6281 8.616L11.0761 8.088L8.72414 10.464L7.35614 9.072L6.80414 9.6ZM7.86014 16.992H9.54014V15.312H7.86014V16.992ZM11.8201 16.56H16.8601V15.72H11.8201V16.56ZM13.1401 11.064H16.8601V10.224H13.1401V11.064Z"
        fill={color}
      />
    </svg>
  );
}

export default ClipboardListCheckUltraLight;
