import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function OneCircledInitMedium({ size = 16, color = "currentColor" }: Props) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.44 13.5359V16.4639H15.36V7.58389H13.128L10.344 10.1519V12.4079L13.176 9.81589H13.512C13.512 9.81589 13.44 11.3999 13.44 13.5359ZM4.19995 11.9999C4.19995 17.2319 8.32795 21.3599 13.56 21.3599H19.7999V19.4399H13.56C9.38395 19.4399 6.11995 16.1759 6.11995 11.9999C6.11995 7.94389 9.38395 4.55989 13.56 4.55989H19.7999V2.63989H13.56C8.30395 2.63989 4.19995 6.91189 4.19995 11.9999Z" fill={color} /></svg>;
}

export default OneCircledInitMedium;