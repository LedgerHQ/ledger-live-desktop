import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function StarUltraLight({ size = 16, color = "currentColor" }: Props) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.64018 21.816L12.0002 17.16L18.3602 21.816L15.9122 14.256L22.3202 9.55199H14.3762L12.0002 2.18399L9.62418 9.55199H1.68018L8.06418 14.256L5.64018 21.816ZM4.05618 10.32H10.2002L12.0002 4.72799L13.8002 10.32H19.9442L15.0002 13.968L16.8722 19.752L12.0002 16.2L7.10418 19.776L8.97618 13.968L4.05618 10.32Z" fill={color} /></svg>;
}

export default StarUltraLight;