import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ArrowBottomUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 21.372L18.624 14.748L18.072 14.196L14.856 17.412C14.04 18.228 13.224 19.044 12.408 19.884V2.628H11.592V19.884C10.776 19.044 9.95998 18.228 9.14398 17.412L5.92798 14.196L5.37598 14.748L12 21.372Z"
        fill={color}
      />
    </svg>
  );
}

export default ArrowBottomUltraLight;
