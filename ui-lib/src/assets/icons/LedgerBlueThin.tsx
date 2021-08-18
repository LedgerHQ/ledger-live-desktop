import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function LedgerBlueThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.76009 21.84H17.7601C18.8641 21.84 19.6801 21.024 19.6801 19.92V8.39997H20.1601V5.03997H19.6801V4.07997C19.6801 2.97597 18.8641 2.15997 17.7601 2.15997H5.76009C4.65609 2.15997 3.84009 2.97597 3.84009 4.07997V19.92C3.84009 21.024 4.65609 21.84 5.76009 21.84ZM4.32009 19.92V4.07997C4.32009 3.16797 4.84809 2.63997 5.76009 2.63997H17.7601C18.6721 2.63997 19.2001 3.16797 19.2001 4.07997V19.92C19.2001 20.832 18.6721 21.36 17.7601 21.36H5.76009C4.84809 21.36 4.32009 20.832 4.32009 19.92ZM6.24009 19.44H17.2801V4.55997H6.24009V19.44ZM6.72009 18.96V5.03997H16.8001V18.96H6.72009Z"
        fill={color}
      />
    </svg>
  );
}

export default LedgerBlueThin;
