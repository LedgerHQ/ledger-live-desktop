import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ShieldCheckLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.9999 21.84C18.2399 19.368 21.3599 15.432 21.3599 10.128V5.08797C18.6959 3.16797 15.4559 2.15997 11.9999 2.15997C8.54389 2.15997 5.30389 3.16797 2.63989 5.08797V10.128C2.63989 15.432 5.75989 19.368 11.9999 21.84ZM3.83989 10.128V5.66397C6.23989 4.07997 8.95189 3.28797 11.9999 3.28797C15.0479 3.28797 17.7599 4.07997 20.1599 5.66397V10.128C20.1599 14.928 17.6159 18.264 11.9999 20.592C6.38389 18.264 3.83989 14.928 3.83989 10.128ZM8.03989 11.184L11.2799 14.448L16.8479 8.87997L16.0079 8.03997L11.2799 12.744L8.87989 10.344L8.03989 11.184Z"
        fill={color}
      />
    </svg>
  );
}

export default ShieldCheckLight;
