import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function RewardsRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.20792 18.18H18.7919V16.812H16.9679C18.9599 15.372 20.1599 13.068 20.1599 10.5C20.1599 6.01197 16.4879 2.33997 11.9999 2.33997C7.51192 2.33997 3.83992 6.01197 3.83992 10.5C3.83992 13.068 5.03992 15.348 7.03192 16.812H5.20792V18.18ZM1.91992 21.66H22.0799V14.82H20.5199V20.196H3.47992V14.82H1.91992V21.66ZM5.39992 10.5C5.39992 6.85197 8.35192 3.89997 11.9999 3.89997C15.6479 3.89997 18.5999 6.85197 18.5999 10.5C18.5999 13.572 16.4399 16.164 13.5839 16.812H10.4399C7.55992 16.164 5.39992 13.572 5.39992 10.5Z"
        fill={color}
      />
    </svg>
  );
}

export default RewardsRegular;
