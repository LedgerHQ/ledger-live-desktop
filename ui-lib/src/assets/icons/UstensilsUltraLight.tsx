import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function UstensilsUltraLight({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.5362 11.64V21.84H8.37619V11.64C10.2722 11.424 11.7122 9.816 11.7122 7.92V2.4H10.9202V7.92C10.9202 9.432 9.84019 10.656 8.37619 10.848V2.4H7.5362V10.848C6.0722 10.656 4.9922 9.432 4.9922 7.92V2.4H4.2002V7.92C4.2002 9.816 5.6642 11.424 7.5362 11.64ZM14.2082 16.8H18.9602V21.84H19.8002V2.16C16.7042 2.16 14.2082 4.632 14.2082 7.728V16.8ZM15.0482 16.008V7.728C15.0482 5.256 16.6802 3.384 18.9602 3.048V16.008H15.0482Z"
        fill={color}
      />
    </svg>
  );
}

export default UstensilsUltraLight;
