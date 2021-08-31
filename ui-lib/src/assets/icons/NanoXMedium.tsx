import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function NanoXMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.4722 22.3199L22.3202 17.4719L6.50418 1.67993L1.68018 6.52793L17.4722 22.3199ZM4.05618 6.52793L6.50418 4.05593L12.5282 10.0559C11.9522 10.1999 11.4002 10.5119 10.9202 10.9679C10.4882 11.3999 10.2002 11.9519 10.0562 12.5279L4.05618 6.52793ZM5.66418 6.57593C5.66418 7.05593 6.07218 7.46393 6.55218 7.46393C7.03218 7.46393 7.46418 7.05593 7.46418 6.57593C7.46418 6.07193 7.03218 5.66393 6.55218 5.66393C6.07218 5.66393 5.66418 6.07193 5.66418 6.57593ZM12.0482 14.5439C11.4242 13.8959 11.4722 12.8159 12.1202 12.1439C12.8162 11.4719 13.8962 11.4719 14.5202 12.0719L19.9442 17.4719L17.4722 19.9439L12.0482 14.5439ZM12.6002 13.5119C12.6002 13.9919 13.0082 14.3999 13.4882 14.3999C13.9682 14.3999 14.4002 13.9919 14.4002 13.5119C14.4002 13.0079 13.9682 12.5999 13.4882 12.5999C13.0082 12.5999 12.6002 13.0079 12.6002 13.5119Z"
        fill={color}
      />
    </svg>
  );
}

export default NanoXMedium;
