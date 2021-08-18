import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function SearchRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.2281 16.404L20.9161 22.068L22.0681 20.916L16.4041 15.228C17.5561 13.836 18.2521 12.036 18.2521 10.092C18.2521 5.60401 14.5801 1.93201 10.0921 1.93201C5.60413 1.93201 1.93213 5.60401 1.93213 10.092C1.93213 14.58 5.60413 18.252 10.0921 18.252C12.0361 18.252 13.8361 17.556 15.2281 16.404ZM3.49213 10.092C3.49213 6.44401 6.46813 3.49201 10.0921 3.49201C13.7401 3.49201 16.6921 6.44401 16.6921 10.092C16.6921 13.716 13.7401 16.692 10.0921 16.692C6.46813 16.692 3.49213 13.716 3.49213 10.092Z"
        fill={color}
      />
    </svg>
  );
}

export default SearchRegular;
