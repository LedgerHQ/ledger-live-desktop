import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function CopyLight({ size = 16, color = "currentColor" }: Props) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.2799 15.36H21.1199V2.88L8.63988 2.904V6.72001H9.83988V4.032H19.9199V14.208H17.2799V15.36ZM2.87988 21.12H15.3599V8.64001H2.87988V21.12ZM4.07988 19.968V9.768H14.1599V19.968H4.07988Z" fill={color} /></svg>;
}

export default CopyLight;