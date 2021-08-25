import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function EightCircledMediMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.9758 16.7039H12.0238C14.0158 16.7039 15.5518 15.5279 15.5518 13.9919C15.5518 13.0559 14.9998 12.2639 14.1118 11.9999V11.7119C14.7838 11.4479 15.2398 10.7279 15.2398 9.93589C15.2398 8.47189 13.7758 7.34389 11.9998 7.34389H11.9758C10.1998 7.34389 8.73577 8.47189 8.73577 9.93589C8.73577 10.7519 9.21577 11.4719 9.91177 11.7359V11.9999C9.02377 12.2639 8.44777 13.0319 8.44777 13.9919C8.44777 15.5279 9.98377 16.7039 11.9758 16.7039ZM5.75977 21.3599H18.2398V19.4399H5.75977V21.3599ZM5.75977 4.55989H18.2398V2.63989H5.75977V4.55989ZM10.4878 14.2079V13.6319C10.4878 13.0319 10.8958 12.7919 11.9038 12.7919H12.1438C13.1758 12.7919 13.5838 13.0319 13.5838 13.6319V14.2079C13.5838 14.8079 13.1758 15.0239 12.1438 15.0239H11.9038C10.8958 15.0239 10.4878 14.8079 10.4878 14.2079ZM10.5838 10.3919V9.81589C10.5838 9.26389 10.9438 9.04789 11.8798 9.04789H12.0958C13.0078 9.04789 13.3918 9.26389 13.3918 9.81589V10.3919C13.3918 10.9439 13.0078 11.1599 12.0958 11.1599H11.8798C10.9438 11.1599 10.5838 10.9439 10.5838 10.3919Z"
        fill={color}
      />
    </svg>
  );
}

export default EightCircledMediMedium;
