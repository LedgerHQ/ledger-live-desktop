import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function HistoryUltraLight({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 21.18C16.92 21.18 21 17.1 21 12.18C21 7.26 16.92 3.18 12 3.18C8.76 3.18 5.952 4.956 4.344 7.62C4.368 6.852 4.368 6.036 4.368 5.268V2.82H3.6V8.964H9.048V8.172H7.104C6.384 8.172 5.64 8.196 4.92 8.196C6.36 5.724 8.976 4.02 12 4.02C16.464 4.02 20.16 7.716 20.16 12.18C20.16 16.644 16.464 20.34 12 20.34C7.536 20.34 3.84 16.644 3.84 12.18H3C3 17.1 7.08 21.18 12 21.18ZM11.592 12.18C11.592 12.3 11.616 12.396 11.712 12.468L15.168 15.924L15.744 15.348L12.432 12.012V6.66H11.592V12.18Z"
        fill={color}
      />
    </svg>
  );
}

export default HistoryUltraLight;
