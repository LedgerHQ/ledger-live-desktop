import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function CheckAloneMedium({ size = 16, color = "currentColor" }: Props) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.67993 12.936L8.39993 19.656L22.3199 5.78399L20.8799 4.34399L8.39993 16.776L3.11993 11.496L1.67993 12.936Z" fill={color} /></svg>;
}

export default CheckAloneMedium;