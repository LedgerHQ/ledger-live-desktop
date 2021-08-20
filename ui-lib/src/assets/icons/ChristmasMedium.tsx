import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ChristmasMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.92 21.8399H13.08V18.7199H21.48L17.376 12.9839H19.608L12 2.15991L4.39202 12.9839H6.62402L2.52002 18.7199H10.92V21.8399ZM6.07202 16.9199L10.176 11.1839H7.89602L12 5.35191L16.104 11.1839H13.824L17.928 16.9199H6.07202Z"
        fill={color}
      />
    </svg>
  );
}

export default ChristmasMedium;
