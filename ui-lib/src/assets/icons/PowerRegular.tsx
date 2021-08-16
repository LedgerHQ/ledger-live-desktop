import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function PowerRegular({ size = 16, color = "currentColor" }: Props) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.2242 22.344L19.9442 9.48001H13.4642L13.7522 1.65601L4.05615 14.52H10.5122L10.2242 22.344ZM6.91215 13.128L12.2162 6.02401L12.0002 10.848H17.0882L11.7602 17.976L12.0002 13.128H6.91215Z" fill={color} /></svg>;
}

export default PowerRegular;