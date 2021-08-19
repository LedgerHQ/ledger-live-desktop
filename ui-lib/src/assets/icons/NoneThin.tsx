import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function NoneThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.0001 20.88C16.9681 20.88 20.8801 16.848 20.8801 12C20.8801 7.032 16.9681 3.12 12.0001 3.12C7.03212 3.12 3.12012 7.032 3.12012 12C3.12012 16.968 7.03212 20.88 12.0001 20.88ZM3.60012 12C3.60012 7.296 7.29612 3.6 12.0001 3.6C14.2561 3.6 16.2961 4.464 17.7841 5.88L5.88012 17.784C4.46412 16.296 3.60012 14.256 3.60012 12ZM6.21612 18.12L18.1201 6.216C19.5361 7.704 20.4001 9.744 20.4001 12C20.4001 16.584 16.7041 20.4 12.0001 20.4C9.74412 20.4 7.70412 19.536 6.21612 18.12Z"
        fill={color}
      />
    </svg>
  );
}

export default NoneThin;
