import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function CircledCrossSolidLight({ size = 16, color = "currentColor" }: Props) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.9999 21.12C17.1119 21.12 21.1199 16.968 21.1199 12C21.1199 6.912 17.0879 2.88 11.9999 2.88C6.91188 2.88 2.87988 6.912 2.87988 12C2.87988 17.088 6.91188 21.12 11.9999 21.12ZM7.46388 15.696L11.1599 12L7.46388 8.28L8.30388 7.44L11.9999 11.16L15.7199 7.44L16.5599 8.28L12.8399 12L16.5599 15.696L15.7199 16.536L11.9999 12.84L8.30388 16.536L7.46388 15.696Z" fill={color} /></svg>;
}

export default CircledCrossSolidLight;