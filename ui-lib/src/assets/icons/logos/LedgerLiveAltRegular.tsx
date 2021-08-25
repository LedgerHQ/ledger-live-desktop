import * as React from "react";

type Props = { width?: number | string; height?: number | string; color?: string };

function LedgerLiveAltRegular({
  width = 38,
  height = 32,
  color = "currentColor",
}: Props): JSX.Element {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 38 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.620148 22.9137V32H14.4471V29.9849H2.63476V22.9137H0.620148ZM35.3653 22.9137V29.9849H23.553V31.9995H37.3799V22.9137H35.3653ZM14.4671 9.08631V22.9132H23.553V21.0961H16.4817V9.08631H14.4671ZM0.620148 0V9.08631H2.63476V2.01461H14.4471V0H0.620148ZM23.553 0V2.01461H35.3653V9.08631H37.3799V0H23.553Z"
        fill={color}
      />
    </svg>
  );
}

export default LedgerLiveAltRegular;
