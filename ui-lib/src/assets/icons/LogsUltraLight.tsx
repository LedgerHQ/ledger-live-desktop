import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function LogsUltraLight({ size = 16, color = "currentColor" }: Props) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.82007 12.828H21.1801V11.988H2.82007V12.828ZM2.82007 18.348H16.3801V17.508H2.82007V18.348ZM2.82007 8.148L4.86007 6.9L2.82007 5.652V8.148ZM7.21207 7.308H21.1801V6.468H7.21207V7.308Z" fill={color} /></svg>;
}

export default LogsUltraLight;