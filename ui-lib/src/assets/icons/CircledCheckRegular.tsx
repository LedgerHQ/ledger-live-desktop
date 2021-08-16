import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function CircledCheckRegular({ size = 16, color = "currentColor" }: Props) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.9998 21.24C17.1838 21.24 21.2398 17.04 21.2398 12C21.2398 6.84001 17.1598 2.76001 11.9998 2.76001C6.83977 2.76001 2.75977 6.84001 2.75977 12C2.75977 17.16 6.83977 21.24 11.9998 21.24ZM4.31977 12C4.31977 7.68001 7.70377 4.32001 11.9998 4.32001C16.3198 4.32001 19.6798 7.68001 19.6798 12C19.6798 16.176 16.3198 19.68 11.9998 19.68C7.70377 19.68 4.31977 16.296 4.31977 12ZM7.89577 12.12L11.1838 15.432L16.7998 9.79201L15.6958 8.71201L11.1838 13.2L8.97577 11.016L7.89577 12.12Z" fill={color} /></svg>;
}

export default CircledCheckRegular;