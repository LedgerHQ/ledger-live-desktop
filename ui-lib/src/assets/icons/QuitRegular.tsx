import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function QuitRegular({ size = 16, color = "currentColor" }: Props) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.54022 21.72H21.7802V2.28003H9.54022V7.68003H11.1002V3.84003H20.2202V20.16H11.1002V16.32H9.54022V21.72ZM2.22021 12L6.56422 16.344L7.52422 15.36L6.27622 14.088C5.82022 13.656 5.34022 13.176 4.86022 12.744H15.6602V11.256H4.83622C5.31622 10.8 5.82022 10.344 6.27622 9.88803L7.52422 8.59203L6.56422 7.63203L2.22021 12Z" fill={color} /></svg>;
}

export default QuitRegular;