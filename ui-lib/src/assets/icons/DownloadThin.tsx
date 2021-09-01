import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function DownloadThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.64014 21.36H21.3601V14.88H17.2801L16.8001 15.36H20.8801V20.88H3.12014V15.36H7.20014L6.72014 14.88H2.64014V21.36ZM5.08814 18.912H6.52814V17.472H5.08814V18.912ZM7.65614 12.216L12.0001 16.56L16.3441 12.216L16.0081 11.88L14.1361 13.752L12.2401 15.648V2.64001H11.7601V15.648L9.86414 13.752L7.99214 11.88L7.65614 12.216Z"
        fill={color}
      />
    </svg>
  );
}

export default DownloadThin;
