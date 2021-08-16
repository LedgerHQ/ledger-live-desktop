import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function FiveCircledMediLight({ size = 16, color = "currentColor" }: Props) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 16.704C13.92 16.704 15.216 15.384 15.216 13.608C15.216 11.856 13.968 10.536 12.24 10.536C11.448 10.536 10.8 10.848 10.368 11.376H10.224L10.536 8.64001H14.688V7.584H9.57601L9.09601 12.744H10.176C10.44 12 10.992 11.592 11.976 11.592H12.072C13.344 11.592 14.016 12.216 14.016 13.416V13.776C14.016 15 13.392 15.624 12.048 15.624H11.952C10.584 15.624 9.98401 14.952 9.96001 13.752H8.76001C8.76001 15.408 10.08 16.704 12 16.704ZM5.76001 21.12H18.24V19.92H5.76001V21.12ZM5.76001 4.08H18.24V2.88H5.76001V4.08Z" fill={color} /></svg>;
}

export default FiveCircledMediLight;