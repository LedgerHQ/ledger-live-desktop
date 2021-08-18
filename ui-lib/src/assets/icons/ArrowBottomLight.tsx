import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ArrowBottomLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 21.372L18.624 14.724L17.88 13.956L14.616 17.244C13.944 17.916 13.248 18.612 12.576 19.308V2.62799H11.424V19.308C10.752 18.612 10.08 17.916 9.40798 17.244L6.14398 13.956L5.37598 14.724L12 21.372Z"
        fill={color}
      />
    </svg>
  );
}

export default ArrowBottomLight;
