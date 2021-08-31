import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function DownloadLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.16016 21.6H21.8402V14.16H17.2802L16.0802 15.36H20.6402V20.472H3.36016V15.36H7.92016L6.72016 14.16H2.16016V21.6ZM5.06416 18.72H6.62416V17.16H5.06416V18.72ZM7.65616 11.976L12.0002 16.32L16.3442 11.976L15.5762 11.208L14.1122 12.672C13.6082 13.176 13.0802 13.728 12.5762 14.256V2.40002H11.4242V14.28C10.9202 13.728 10.3922 13.2 9.88816 12.672L8.40016 11.208L7.65616 11.976Z"
        fill={color}
      />
    </svg>
  );
}

export default DownloadLight;
