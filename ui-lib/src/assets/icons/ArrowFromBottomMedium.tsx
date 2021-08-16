import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function ArrowFromBottomMedium({ size = 16, color = "currentColor" }: Props) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.0881 6.09588V16.7999H12.9121V6.07188C13.2961 6.50388 13.7041 6.93588 14.0881 7.34388L16.3201 9.55188L17.4961 8.37588L12.0001 2.87988L6.5041 8.37588L7.7041 9.55188L9.9121 7.34388C10.2961 6.95988 10.7041 6.52788 11.0881 6.09588ZM3.6001 21.1199H20.4001V19.1999H3.6001V21.1199Z" fill={color} /></svg>;
}

export default ArrowFromBottomMedium;