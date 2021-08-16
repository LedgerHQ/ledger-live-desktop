import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function MedalUltraLight({ size = 16, color = "currentColor" }: Props) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.01999 13.728V21.48L11.988 18.696L16.98 21.48V13.728C18.036 12.528 18.708 10.944 18.708 9.216C18.708 5.544 15.684 2.52 11.988 2.52C8.29199 2.52 5.29199 5.544 5.29199 9.216C5.29199 10.944 5.93999 12.528 7.01999 13.728ZM6.13199 9.216C6.13199 6 8.74799 3.36 11.988 3.36C15.228 3.36 17.868 6 17.868 9.216C17.868 12.456 15.228 15.096 11.988 15.096C8.74799 15.096 6.13199 12.456 6.13199 9.216ZM7.81199 20.136V14.424C8.96399 15.36 10.404 15.936 11.988 15.936C13.572 15.936 15.012 15.36 16.164 14.424V20.136L11.988 17.808L7.81199 20.136Z" fill={color} /></svg>;
}

export default MedalUltraLight;