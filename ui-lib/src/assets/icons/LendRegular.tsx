import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function LendRegular({ size = 16, color = "currentColor" }: Props) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.83211 13.56V15.024C9.67211 14.136 15.4321 10.56 19.8721 5.424C19.8481 6.144 19.8481 6.864 19.8481 7.56V9.288H21.1921V3.12H15.0481V4.488H16.6801C17.3521 4.488 18.0721 4.488 18.7441 4.464C14.5441 9.336 9.24011 12.672 2.83211 13.56ZM2.80811 20.88H4.46411V17.952H2.80811V20.88ZM6.98411 20.88H8.64011V16.608H6.98411V20.88ZM11.1841 20.88H12.8161V15.192H11.1841V20.88ZM15.3601 20.88H17.0161V13.824H15.3601V20.88ZM19.5121 20.88H21.1681V12.48H19.5121V20.88Z" fill={color} /></svg>;
}

export default LendRegular;