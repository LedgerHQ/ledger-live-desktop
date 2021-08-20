import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function WalletAddMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.0001 19.9201H21.3601V6.72012H6.36014V8.52012H19.4401V18.1201H12.0001V19.9201ZM2.64014 17.6881H5.83214V20.8801H7.63214V17.6881H10.8001V15.8881H7.63214V12.7201H5.83214V15.8881H2.64014V17.6881ZM2.64014 11.5201H4.44014V5.04012C4.44014 4.92012 4.44014 4.92012 4.56014 4.92012H19.4401C19.3921 3.86412 18.5761 3.12012 17.5201 3.12012H4.56014C3.45614 3.12012 2.64014 3.93612 2.64014 5.04012V11.5201ZM15.0481 13.4401C15.0481 14.1121 15.6001 14.7121 16.3201 14.7121C17.0161 14.7121 17.5681 14.1121 17.5681 13.4401C17.5681 12.7441 17.0161 12.1921 16.3201 12.1921C15.6001 12.1921 15.0481 12.7441 15.0481 13.4401Z"
        fill={color}
      />
    </svg>
  );
}

export default WalletAddMedium;
