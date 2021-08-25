import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function EightCircledMediLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.9758 16.704H12.0238C13.9438 16.704 15.3358 15.552 15.3358 14.04C15.3358 13.056 14.7598 12.24 13.7758 11.928V11.76C14.5678 11.448 15.0718 10.704 15.0718 9.84C15.0718 8.42401 13.7518 7.34401 12.0238 7.34401H11.9758C10.2478 7.34401 8.92777 8.42401 8.92777 9.84C8.92777 10.728 9.43177 11.448 10.2478 11.76V11.928C9.26377 12.24 8.66377 13.056 8.66377 14.04C8.66377 15.552 10.0558 16.704 11.9758 16.704ZM5.75977 21.12H18.2398V19.92H5.75977V21.12ZM5.75977 4.08H18.2398V2.88H5.75977V4.08ZM9.93577 14.16V13.848C9.93577 12.936 10.5838 12.432 11.9518 12.432H12.0958C13.4638 12.432 14.1118 12.936 14.1118 13.848V14.16C14.1118 15.096 13.4398 15.624 12.0958 15.624H11.9518C10.6078 15.624 9.93577 15.096 9.93577 14.16ZM10.0798 10.08V9.768C10.0798 8.928 10.7038 8.42401 11.9278 8.42401H12.0718C13.2718 8.42401 13.9198 8.928 13.9198 9.768V10.08C13.9198 10.92 13.2958 11.4 12.0718 11.4H11.9278C10.6798 11.4 10.0798 10.92 10.0798 10.08Z"
        fill={color}
      />
    </svg>
  );
}

export default EightCircledMediLight;
