import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function BarChartMedium({ size = 16, color = "currentColor" }: Props) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.5842 20.8801H21.8402V3.12012H16.5842V20.8801ZM2.16016 20.8801H7.41616V7.36812H2.16016V20.8801ZM3.84016 19.2001V9.04812H5.73616V19.2001H3.84016ZM9.36016 20.8801H14.6402V10.8241H9.36016V20.8801ZM11.0402 19.2001V12.5041H12.9602V19.2001H11.0402ZM18.2642 19.2001V4.80012H20.1602V19.2001H18.2642Z" fill={color} /></svg>;
}

export default BarChartMedium;