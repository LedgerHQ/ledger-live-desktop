import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function UnlockUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.90404 21.18H21.96V9.58801H12.216V7.88401C12.216 5.10001 9.91204 2.82001 7.12804 2.82001C4.34404 2.82001 2.04004 5.10001 2.04004 7.88401V11.22H2.88004V7.88401C2.88004 5.55601 4.80004 3.63601 7.12804 3.63601C9.48004 3.63601 11.376 5.55601 11.376 7.88401V9.58801H8.90404V21.18ZM9.74404 20.364V10.404H21.12V20.364H9.74404ZM15.024 17.34H15.864V13.26H15.024V17.34Z"
        fill={color}
      />
    </svg>
  );
}

export default UnlockUltraLight;
