import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function FourCircledInitUltraLight({ size = 16, color = "currentColor" }: Props) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.8601 11.856V13.656H10.1401L13.5961 8.472H13.8601V11.856ZM4.06812 12C4.06812 17.04 8.02812 21 13.0681 21H19.9321V20.16H13.0681C8.50811 20.16 4.90812 16.56 4.90812 12C4.90812 7.536 8.50811 3.84 13.0681 3.84H19.9321V3H13.0681C8.02812 3 4.06812 7.08 4.06812 12ZM9.32411 14.4H13.8601V16.464H14.6761V14.4H16.1401V13.656H14.6761V7.584H13.3321L9.32411 13.632V14.4Z" fill={color} /></svg>;
}

export default FourCircledInitUltraLight;