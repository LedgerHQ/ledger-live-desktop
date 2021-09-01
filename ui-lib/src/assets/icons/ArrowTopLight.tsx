import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ArrowTopLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.424 4.69199V21.372H12.576V4.69199C13.248 5.38799 13.944 6.08399 14.616 6.75599L17.88 10.02L18.624 9.25199L12 2.62799L5.37598 9.25199L6.14398 10.02L9.40798 6.75599C10.08 6.08399 10.752 5.38799 11.424 4.69199Z"
        fill={color}
      />
    </svg>
  );
}

export default ArrowTopLight;
