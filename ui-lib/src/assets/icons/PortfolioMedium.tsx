import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function PortfolioMedium({ size = 16, color = "currentColor" }: Props) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.64014 19.9201H21.3601V18.0481H4.56014V4.08008H2.64014V19.9201ZM6.24014 15.0001L10.8961 10.4161L13.7761 13.2961L21.3601 5.71208L20.0641 4.41608L13.7761 10.7041L10.8961 7.82408L6.24014 12.4561V15.0001Z" fill={color} /></svg>;
}

export default PortfolioMedium;