import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function NineCircledFinaUltraLight({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.9561 16.704C13.1641 16.704 14.4121 14.832 14.3881 11.904C14.3641 9.048 13.1161 7.344 10.9801 7.344C9.22812 7.344 7.90811 8.664 7.90811 10.464C7.90811 12.216 9.18011 13.536 10.9081 13.536C12.1321 13.536 13.1161 12.816 13.4761 11.736H13.5481C13.6441 14.04 13.0921 15.936 10.9321 15.936C9.66011 15.936 8.91611 15.24 8.72411 13.968H7.90811C8.07612 15.624 9.30012 16.704 10.9561 16.704ZM4.06812 21H10.9321C15.9721 21 19.9321 16.896 19.9321 12C19.9321 6.96 15.9721 3 10.9321 3H4.06812V3.84H10.9321C15.5161 3.84 19.0921 7.416 19.0921 12C19.0921 16.44 15.5161 20.16 10.9321 20.16H4.06812V21ZM8.74812 10.536V10.32C8.74812 8.976 9.56412 8.136 10.9561 8.136H11.0521C12.4921 8.136 13.2601 9.072 13.2601 10.32V10.536C13.2601 11.88 12.4681 12.744 11.0521 12.744H10.9561C9.56412 12.744 8.74812 11.904 8.74812 10.536Z"
        fill={color}
      />
    </svg>
  );
}

export default NineCircledFinaUltraLight;
