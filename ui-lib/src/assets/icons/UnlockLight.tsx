import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function UnlockLight({ size = 16, color = "currentColor" }: Props) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.78392 21.24H22.0799V9.60001H12.3359V7.89601C12.3359 5.06401 9.95992 2.76001 7.12792 2.76001C4.29592 2.76001 1.91992 5.06401 1.91992 7.89601V11.28H3.11992V7.89601C3.11992 5.71201 4.91992 3.88801 7.12792 3.88801C9.33592 3.88801 11.1359 5.71201 11.1359 7.89601V9.60001H8.78392V21.24ZM9.98392 20.088V10.728H20.8799V20.088H9.98392ZM14.8319 17.4H16.0319V13.32H14.8319V17.4Z" fill={color} /></svg>;
}

export default UnlockLight;