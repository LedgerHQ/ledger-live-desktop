import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function BringFrontLight({ size = 16, color = "currentColor" }: Props) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.7199 21.12H21.1199V12.72H18.3599V13.848H19.9919V19.968H13.8719V18.36H12.7199V21.12ZM2.87988 11.28H5.63988V10.128H4.03188V4.008H10.3919V5.64H11.5199V2.88H2.87988V11.28ZM7.79988 16.2H16.1999V7.8H7.79988V16.2ZM8.95188 15.048V8.928H15.0719V15.048H8.95188Z" fill={color} /></svg>;
}

export default BringFrontLight;