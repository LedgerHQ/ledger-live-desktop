import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function UnlockRegular({ size = 16, color = "currentColor" }: Props) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.66381 21.2999H22.1998V9.58795H12.4558V7.93195C12.4558 5.02795 10.0078 2.69995 7.12781 2.69995C4.2478 2.69995 1.7998 5.02795 1.7998 7.93195V11.34H3.3598V7.93195C3.3598 5.89195 5.0638 4.16395 7.12781 4.16395C9.21581 4.16395 10.8958 5.89195 10.8958 7.93195V9.58795H8.66381V21.2999ZM10.2238 19.836V11.076H20.6398V19.836H10.2238ZM14.6638 17.46H16.2238V13.38H14.6638V17.46Z" fill={color} /></svg>;
}

export default UnlockRegular;