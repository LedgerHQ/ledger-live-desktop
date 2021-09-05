import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ActivityRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.3999 12.852H6.7439L9.0959 5.796L14.9039 23.172L18.3839 12.852H21.5999V11.196H17.2799L14.9039 18.228L9.0959 0.828003L5.6399 11.196H2.3999V12.852Z"
        fill={color}
      />
    </svg>
  );
}

export default ActivityRegular;
