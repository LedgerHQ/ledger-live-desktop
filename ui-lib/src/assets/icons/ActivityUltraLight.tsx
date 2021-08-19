import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ActivityUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.9082 12.456H6.0842L8.8922 4.056L15.0602 22.608L18.4922 12.456H22.0922V11.592H17.8922L15.0602 19.944L8.8922 1.392L5.5082 11.592H1.9082V12.456Z"
        fill={color}
      />
    </svg>
  );
}

export default ActivityUltraLight;
