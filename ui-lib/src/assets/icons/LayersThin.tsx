import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function LayersThin({ size = 16, color = "currentColor" }: Props) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.0001 11.904L21.3601 7.488L12.0001 3.12L2.64014 7.488L12.0001 11.904ZM2.64014 16.488L12.0001 20.88L21.3601 16.488L19.2001 15.456L18.6241 15.72L20.2321 16.488L12.0001 20.352L3.76814 16.488L5.37614 15.72L4.80014 15.456L2.64014 16.488ZM2.64014 12L12.0001 16.392L21.3601 12L19.2001 10.968L18.6241 11.232L20.2321 12L12.0001 15.864L3.76814 12L5.37614 11.232L4.80014 10.968L2.64014 12ZM3.76814 7.488L12.0001 3.648L20.2321 7.488L12.0001 11.376L3.76814 7.488Z" fill={color} /></svg>;
}

export default LayersThin;