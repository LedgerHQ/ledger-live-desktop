import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function CircledCrossSolidRegular({ size = 16, color = "currentColor" }: Props) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.9998 21.24C17.1838 21.24 21.2398 17.04 21.2398 12C21.2398 6.84001 17.1598 2.76001 11.9998 2.76001C6.83977 2.76001 2.75977 6.84001 2.75977 12C2.75977 17.16 6.83977 21.24 11.9998 21.24ZM7.31977 15.576L10.8958 12L7.31977 8.42401L8.42377 7.32001L11.9998 10.896L15.5758 7.32001L16.6798 8.42401L13.1038 12L16.6798 15.576L15.5758 16.68L11.9998 13.104L8.42377 16.68L7.31977 15.576Z" fill={color} /></svg>;
}

export default CircledCrossSolidRegular;