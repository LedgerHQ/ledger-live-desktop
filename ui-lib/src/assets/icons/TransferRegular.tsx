import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function TransferRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.0159 12.312L21.3599 7.94398L17.0159 3.59998L16.0559 4.58398L17.3039 5.83198C17.7599 6.28798 18.2399 6.74398 18.7199 7.19998H3.59989V8.68798H18.7679C18.2639 9.14398 17.7839 9.59998 17.3039 10.056L16.0559 11.328L17.0159 12.312ZM2.63989 16.056L6.98389 20.4L7.94389 19.416L6.69589 18.144C6.23989 17.712 5.75989 17.232 5.27989 16.8H20.3999V15.312H5.25589C5.73589 14.856 6.23989 14.4 6.69589 13.944L7.94389 12.648L6.98389 11.688L2.63989 16.056Z"
        fill={color}
      />
    </svg>
  );
}

export default TransferRegular;
