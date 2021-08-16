import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function DownloadUltraLight({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.3999 21.48H21.5999V14.52H17.2799L16.4399 15.36H20.7599V20.664H3.2399V15.36H7.5599L6.7199 14.52H2.3999V21.48ZM5.0879 18.816H6.5759V17.328H5.0879V18.816ZM7.6559 12.096L11.9999 16.44L16.3439 12.096L15.7919 11.544L14.1359 13.224C13.5599 13.776 12.9839 14.376 12.4079 14.952V2.52H11.5919V14.952C11.0159 14.376 10.4399 13.776 9.8639 13.224L8.2079 11.544L7.6559 12.096Z"
        fill={color}
      />
    </svg>
  );
}

export default DownloadUltraLight;
