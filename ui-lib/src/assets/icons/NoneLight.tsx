import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function NoneLight({ size = 16, color = "currentColor" }: Props) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.9999 21.12C17.1119 21.12 21.1199 16.968 21.1199 12C21.1199 6.912 17.0879 2.88 11.9999 2.88C6.91188 2.88 2.87988 6.912 2.87988 12C2.87988 17.088 6.91188 21.12 11.9999 21.12ZM4.07988 12C4.07988 7.56 7.55988 4.08 11.9999 4.08C13.9919 4.08 15.7919 4.776 17.1839 5.952L5.95188 17.184C4.77588 15.792 4.07988 13.992 4.07988 12ZM6.81588 18.048L18.0479 6.816C19.2239 8.208 19.9199 10.008 19.9199 12C19.9199 16.32 16.4399 19.92 11.9999 19.92C10.0079 19.92 8.20788 19.224 6.81588 18.048Z" fill={color} /></svg>;
}

export default NoneLight;