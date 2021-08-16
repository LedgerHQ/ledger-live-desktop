import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function DropupUltraLight({ size = 16, color = "currentColor" }: Props) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.9999 9.036L17.3279 14.388L16.7519 14.964L11.9999 10.236L7.24787 14.964L6.67188 14.388L11.9999 9.036Z" fill={color} /></svg>;
}

export default DropupUltraLight;