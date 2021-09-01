import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function StopwatchLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 21.72C16.416 21.72 20.04 18.096 20.04 13.68C20.04 11.688 19.32 9.86403 18.096 8.47203L19.416 7.17603L18.504 6.26403L17.208 7.58403C15.96 6.48003 14.352 5.78403 12.6 5.66403V3.48003H14.52V2.28003H9.47996V3.48003H11.4V5.66403C7.24796 5.97603 3.95996 9.45603 3.95996 13.68C3.95996 18.096 7.58396 21.72 12 21.72ZM5.15996 13.68C5.15996 9.91203 8.23196 6.84003 12 6.84003C15.768 6.84003 18.84 9.91203 18.84 13.68C18.84 17.448 15.768 20.52 12 20.52C8.23196 20.52 5.15996 17.448 5.15996 13.68ZM11.4 14.16C11.4 14.496 11.664 14.76 12 14.76C12.336 14.76 12.6 14.496 12.6 14.16V8.64003H11.4V14.16Z"
        fill={color}
      />
    </svg>
  );
}

export default StopwatchLight;
