import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function SupportLight({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.6322 21.12H13.3922C14.0882 21.12 14.6642 20.64 14.6882 19.824C16.6562 19.032 18.0722 17.28 18.4562 15.192H18.8882C20.5682 15.192 21.8402 13.896 21.8402 12.24V11.28C21.8402 9.60001 20.5682 8.328 18.8882 8.328H18.4562C17.9522 5.256 15.2642 2.88 12.0002 2.88C8.73616 2.88 6.04816 5.256 5.54416 8.328H5.11216C3.45616 8.328 2.16016 9.60001 2.16016 11.28V12.24C2.16016 13.896 3.45616 15.192 5.11216 15.192H6.64816V9.432C6.64816 6.456 9.02416 4.008 12.0002 4.008C14.9762 4.008 17.3762 6.456 17.3762 9.432V14.04C17.3762 15.984 16.2722 17.688 14.6642 18.528C14.6162 17.832 14.0642 17.352 13.3922 17.352H10.6322C9.86416 17.352 9.31216 17.904 9.31216 18.672V19.8C9.31216 20.568 9.86416 21.12 10.6322 21.12ZM3.24016 12.24V11.28C3.24016 10.056 3.88816 9.408 5.11216 9.408H5.44816V14.112H5.11216C3.88816 14.112 3.24016 13.464 3.24016 12.24ZM10.3202 19.728V18.744C10.3202 18.504 10.4402 18.36 10.7042 18.36H13.3202C13.5602 18.36 13.6802 18.504 13.6802 18.744V19.728C13.6802 19.968 13.5602 20.088 13.3202 20.088H10.7042C10.4402 20.088 10.3202 19.968 10.3202 19.728ZM18.5762 14.112V9.408H18.8882C20.1122 9.408 20.7602 10.056 20.7602 11.28V12.24C20.7602 13.464 20.1122 14.112 18.8882 14.112H18.5762Z"
        fill={color}
      />
    </svg>
  );
}

export default SupportLight;
