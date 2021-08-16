import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function CloseMedium({ size = 16, color = "currentColor" }: Props) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.3279 18.84L13.4879 12L20.3279 5.15997L18.7919 3.71997L11.9999 10.512L5.20787 3.71997L3.67188 5.15997L10.5119 12L3.67188 18.84L5.20787 20.28L11.9999 13.488L18.7919 20.28L20.3279 18.84Z" fill={color} /></svg>;
}

export default CloseMedium;