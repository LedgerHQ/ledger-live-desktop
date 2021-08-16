import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function MailThin({ size = 16, color = "currentColor" }: Props) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.12012 18.852H20.8801V5.14801H3.12012V18.852ZM3.60012 18.372V8.22001L12.0001 14.94L20.4001 8.22001V18.372H3.60012ZM3.60012 7.59601V5.62801H20.4001V7.59601L12.0001 14.316L3.60012 7.59601Z" fill={color} /></svg>;
}

export default MailThin;