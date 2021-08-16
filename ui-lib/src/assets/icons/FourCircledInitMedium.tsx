import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function FourCircledInitMedium({ size = 16, color = "currentColor" }: Props) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.464 12.4079V13.1039H11.232L13.488 9.69589H13.512C13.488 10.4879 13.464 11.4959 13.464 12.4079ZM4.19995 11.9999C4.19995 17.2319 8.32795 21.3599 13.56 21.3599H19.7999V19.4399H13.56C9.38395 19.4399 6.11995 16.1759 6.11995 11.9999C6.11995 7.94389 9.38395 4.55989 13.56 4.55989H19.7999V2.63989H13.56C8.30395 2.63989 4.19995 6.91189 4.19995 11.9999ZM9.45595 14.6639H13.464V16.4639H15.264V14.6639H16.632V13.1039H15.264V7.58389H13.248L9.45595 13.2959V14.6639Z" fill={color} /></svg>;
}

export default FourCircledInitMedium;