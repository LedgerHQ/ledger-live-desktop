import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function ChristmasLight({ size = 16, color = "currentColor" }: Props) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.3399 21.36H12.6599V18.36H21.0599L17.0279 12.72H19.0679L11.9879 2.64001L4.90794 12.72H6.97194L2.93994 18.36H11.3399V21.36ZM5.17194 17.208L9.20394 11.592H7.11594L11.9879 4.65601L16.8599 11.592H14.7719L18.8039 17.208H5.17194Z" fill={color} /></svg>;
}

export default ChristmasLight;