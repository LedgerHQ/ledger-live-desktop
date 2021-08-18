import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function DownloadRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.91992 21.72H22.0799V13.8H17.2799L15.7199 15.36H20.5199V20.256H3.47992V15.36H8.27992L6.71992 13.8H1.91992V21.72ZM5.06392 18.648H6.67192V17.016H5.06392V18.648ZM7.63192 11.856L11.9999 16.2L16.3439 11.856L15.3599 10.896L14.1119 12.144C13.6559 12.6 13.1999 13.08 12.7439 13.56V2.28003H11.2559V13.584C10.7999 13.104 10.3439 12.6 9.88792 12.144L8.61592 10.896L7.63192 11.856Z"
        fill={color}
      />
    </svg>
  );
}

export default DownloadRegular;
