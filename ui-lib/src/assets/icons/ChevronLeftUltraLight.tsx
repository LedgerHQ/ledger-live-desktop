import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function ChevronLeftUltraLight({ size = 16, color = "currentColor" }: Props) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.644 20.112L8.55596 12L16.644 3.888L16.068 3.312L7.35596 12L16.068 20.688L16.644 20.112Z" fill={color} /></svg>;
}

export default ChevronLeftUltraLight;