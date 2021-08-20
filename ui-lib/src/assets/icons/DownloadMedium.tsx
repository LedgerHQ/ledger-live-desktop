import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function DownloadMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.68018 21.8399H22.3202V13.4399H17.2802L15.3602 15.3599H20.4002V20.0399H3.60018V15.3599H8.64018L6.72018 13.4399H1.68018V21.8399ZM5.04018 18.5519H6.72018V16.8719H5.04018V18.5519ZM7.63218 11.7359L12.0002 16.0799L16.3442 11.7359L15.1442 10.5599L14.0882 11.6159C13.7042 11.9999 13.2962 12.4319 12.9122 12.8639V2.15991H11.0882V12.9119C10.6802 12.4559 10.2962 12.0239 9.88818 11.6159L8.80818 10.5599L7.63218 11.7359Z"
        fill={color}
      />
    </svg>
  );
}

export default DownloadMedium;
