import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function QuitUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.89984 21.48H21.6598V2.52H9.89984V7.68H10.7398V3.36H20.8198V20.64H10.7398V16.32H9.89984V21.48ZM2.33984 12L6.68384 16.344L7.23584 15.792L5.55584 14.112C5.00384 13.56 4.40384 12.96 3.82784 12.408H15.7798V11.592H3.82784C4.40384 11.016 5.00384 10.44 5.55584 9.864L7.23584 8.184L6.68384 7.656L2.33984 12Z"
        fill={color}
      />
    </svg>
  );
}

export default QuitUltraLight;
