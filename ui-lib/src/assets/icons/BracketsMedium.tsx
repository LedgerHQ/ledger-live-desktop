import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function BracketsMedium({ size = 16, color = "currentColor" }: Props) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.4399 10.1999H21.3599V2.63989H13.7999V4.55989H19.4399V10.1999ZM2.63989 21.3359H10.1999V19.4159H4.55989V13.7759H2.63989V21.3359ZM2.63989 10.1999H4.55989V4.55989H10.1999V2.63989H2.63989V10.1999ZM13.7999 21.3599H21.3599V13.7999H19.4399V19.4399H13.7999V21.3599Z" fill={color} /></svg>;
}

export default BracketsMedium;