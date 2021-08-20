import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function SevenCircledInitMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.664 16.4639H13.872C14.088 13.4399 15.0719 11.0639 17.016 9.09589V7.58389H10.2V9.23989H14.688V9.55189C12.912 11.7839 11.952 13.9919 11.664 16.4639ZM4.19995 11.9999C4.19995 17.2319 8.32795 21.3599 13.56 21.3599H19.7999V19.4399H13.56C9.38395 19.4399 6.11995 16.1759 6.11995 11.9999C6.11995 7.94389 9.38395 4.55989 13.56 4.55989H19.7999V2.63989H13.56C8.30395 2.63989 4.19995 6.91189 4.19995 11.9999Z"
        fill={color}
      />
    </svg>
  );
}

export default SevenCircledInitMedium;
