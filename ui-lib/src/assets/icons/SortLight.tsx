import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function SortLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.3121 6.98401L7.9441 2.64001L3.6001 6.98401L4.3681 7.72801L5.8321 6.26401C6.3361 5.76002 6.8641 5.23201 7.3681 4.70401V20.4H8.5201V4.68001C9.0481 5.20801 9.5521 5.76002 10.0801 6.26401L11.5441 7.72801L12.3121 6.98401ZM11.7121 17.016L16.0561 21.36L20.4001 17.016L19.6321 16.248L18.1681 17.712C17.6641 18.216 17.1361 18.768 16.6321 19.296V3.60001H15.4801V19.32C14.9761 18.768 14.4481 18.24 13.9441 17.712L12.4561 16.248L11.7121 17.016Z"
        fill={color}
      />
    </svg>
  );
}

export default SortLight;
