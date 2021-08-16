import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function FolderThin({ size = 16, color = "currentColor" }: Props) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.12012 19.92H20.8801V5.92802H12.0001L10.8241 4.75202C10.3441 4.27202 9.86412 4.08002 9.16812 4.08002H3.12012V19.92ZM3.60012 19.44V9.28802H20.4001V19.44H3.60012ZM3.60012 8.80802V4.56002H9.16812C9.76812 4.56002 10.0801 4.68002 10.4881 5.08802L11.8081 6.40802H20.4001V8.80802H3.60012Z" fill={color} /></svg>;
}

export default FolderThin;