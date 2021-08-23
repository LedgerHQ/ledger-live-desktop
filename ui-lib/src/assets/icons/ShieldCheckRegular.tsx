import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ShieldCheckRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.9999 21.84C18.2399 19.368 21.3599 15.432 21.3599 10.128V5.08803C18.6959 3.16803 15.4559 2.16003 11.9999 2.16003C8.54389 2.16003 5.30389 3.16803 2.63989 5.08803V10.128C2.63989 15.432 5.75989 19.368 11.9999 21.84ZM4.19989 10.128V5.83203C6.50389 4.34403 9.07189 3.62403 11.9999 3.62403C14.9279 3.62403 17.4959 4.34403 19.7999 5.83203V10.128C19.7999 14.784 17.3999 17.952 11.9999 20.232C6.59989 17.952 4.19989 14.784 4.19989 10.128ZM7.99189 11.256L11.2799 14.568L16.8959 8.92803L15.7919 7.84803L11.2799 12.336L9.07189 10.152L7.99189 11.256Z"
        fill={color}
      />
    </svg>
  );
}

export default ShieldCheckRegular;
