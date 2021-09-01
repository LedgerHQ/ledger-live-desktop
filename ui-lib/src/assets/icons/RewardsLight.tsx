import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function RewardsLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.25616 18.024H18.7682V16.944H16.7042C18.7682 15.504 20.0402 13.176 20.0402 10.56C20.0402 6.14402 16.4162 2.52002 12.0002 2.52002C7.58416 2.52002 3.96016 6.14402 3.96016 10.56C3.96016 13.176 5.20816 15.504 7.29616 16.944H5.25616V18.024ZM2.16016 21.48H21.8402V14.88H20.6402V20.328H3.36016V14.88H2.16016V21.48ZM5.16016 10.56C5.16016 6.76802 8.23216 3.72002 12.0002 3.72002C15.7922 3.72002 18.8402 6.76802 18.8402 10.56C18.8402 13.608 16.8242 16.152 14.0642 16.944H9.93616C7.20016 16.152 5.16016 13.608 5.16016 10.56Z"
        fill={color}
      />
    </svg>
  );
}

export default RewardsLight;
