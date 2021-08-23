import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function EightCircledMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.0001 21.3599C17.2561 21.3599 21.3601 17.0879 21.3601 11.9999C21.3601 6.76789 17.2321 2.63989 12.0001 2.63989C6.76814 2.63989 2.64014 6.76789 2.64014 11.9999C2.64014 17.2319 6.76814 21.3599 12.0001 21.3599ZM4.56014 11.9999C4.56014 7.82389 7.82414 4.55989 12.0001 4.55989C16.1761 4.55989 19.4401 7.82389 19.4401 11.9999C19.4401 16.0559 16.1761 19.4399 12.0001 19.4399C7.82414 19.4399 4.56014 16.1759 4.56014 11.9999ZM8.44814 13.9919C8.44814 15.5279 9.98414 16.7039 11.9761 16.7039H12.0241C14.0161 16.7039 15.5521 15.5279 15.5521 13.9919C15.5521 13.0559 15.0001 12.2639 14.1121 11.9999V11.7119C14.7841 11.4479 15.2401 10.7279 15.2401 9.93589C15.2401 8.47189 13.7761 7.34389 12.0001 7.34389H11.9761C10.2001 7.34389 8.73614 8.47189 8.73614 9.93589C8.73614 10.7519 9.21614 11.4719 9.91214 11.7359V11.9999C9.02414 12.2639 8.44814 13.0319 8.44814 13.9919ZM10.4881 14.2079V13.6319C10.4881 13.0319 10.8961 12.7919 11.9041 12.7919H12.1441C13.1761 12.7919 13.5841 13.0319 13.5841 13.6319V14.2079C13.5841 14.8079 13.1761 15.0239 12.1441 15.0239H11.9041C10.8961 15.0239 10.4881 14.8079 10.4881 14.2079ZM10.5841 10.3919V9.81589C10.5841 9.26389 10.9441 9.04789 11.8801 9.04789H12.0961C13.0081 9.04789 13.3921 9.26389 13.3921 9.81589V10.3919C13.3921 10.9439 13.0081 11.1599 12.0961 11.1599H11.8801C10.9441 11.1599 10.5841 10.9439 10.5841 10.3919Z"
        fill={color}
      />
    </svg>
  );
}

export default EightCircledMedium;
