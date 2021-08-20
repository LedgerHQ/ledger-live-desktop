import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function PenThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.63989 21.36L7.79989 19.92L21.3599 6.38402L17.6159 2.64001L4.07989 16.2L2.63989 21.36ZM3.33589 20.664L4.51189 16.44L7.55989 19.488L3.33589 20.664ZM4.84789 16.104L14.9759 5.97601L18.0239 9.02402L7.89589 19.152L4.84789 16.104ZM15.3119 5.61601L17.6159 3.31201L20.6879 6.38402L18.3599 8.68801L15.3119 5.61601Z"
        fill={color}
      />
    </svg>
  );
}

export default PenThin;
