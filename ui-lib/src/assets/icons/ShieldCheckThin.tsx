import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function ShieldCheckThin({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.9999 21.84C18.2399 19.368 21.3599 15.432 21.3599 10.128V5.088C18.6959 3.168 15.4559 2.16 11.9999 2.16C8.54389 2.16 5.30389 3.168 2.63989 5.088V10.128C2.63989 15.432 5.75989 19.368 11.9999 21.84ZM3.11989 10.128V5.328C5.68789 3.552 8.71189 2.64 11.9999 2.64C15.2879 2.64 18.3119 3.552 20.8799 5.328V10.128C20.8799 15.216 17.9999 18.888 11.9999 21.312C5.99989 18.888 3.11989 15.216 3.11989 10.128ZM8.15989 11.088L11.2799 14.208L16.7279 8.76L16.3919 8.424L11.2799 13.536L8.49589 10.752L8.15989 11.088Z"
        fill={color}
      />
    </svg>
  );
}

export default ShieldCheckThin;
