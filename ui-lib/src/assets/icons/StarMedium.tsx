import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function StarMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.64018 21.8161L12.0002 17.1601L18.3602 21.8161L15.9122 14.2561L22.3202 9.55208H14.3762L12.0002 2.18408L9.62418 9.55208H1.68018L8.06418 14.2561L5.64018 21.8161ZM6.79218 11.2321H10.8482L12.0002 7.65608L13.1522 11.2321H17.1842L13.9442 13.6081L15.1682 17.4001L12.0002 15.0721L8.80818 17.4001L10.0322 13.6081L6.79218 11.2321Z"
        fill={color}
      />
    </svg>
  );
}

export default StarMedium;
