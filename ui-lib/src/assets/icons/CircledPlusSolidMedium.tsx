import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function CircledPlusSolidMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.0001 21.3599C17.2561 21.3599 21.3601 17.0879 21.3601 11.9999C21.3601 6.76789 17.2321 2.63989 12.0001 2.63989C6.76814 2.63989 2.64014 6.76789 2.64014 11.9999C2.64014 17.2319 6.76814 21.3599 12.0001 21.3599ZM6.62414 12.9599V11.0399H10.9921V6.62389H13.0321V11.0399H17.3761V12.9599H13.0321V17.3759H10.9921V12.9599H6.62414Z"
        fill={color}
      />
    </svg>
  );
}

export default CircledPlusSolidMedium;
