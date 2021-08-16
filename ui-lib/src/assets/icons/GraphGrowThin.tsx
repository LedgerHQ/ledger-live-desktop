import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function GraphGrowThin({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.35986 13.584L7.58386 9.384H14.7119L20.1599 3.936V7.248V9.288H20.6399V3.12H14.4959V3.6H16.5359H19.8239L14.5199 8.904H7.39186L3.35986 12.912V13.584ZM3.35986 20.88H3.83986V17.952H3.35986V20.88ZM7.55986 20.88H8.03986V16.056H7.55986V20.88ZM11.7599 20.88H12.2399V12.96H11.7599V20.88ZM15.9599 20.88H16.4399V15.12H15.9599V20.88ZM20.1599 20.88H20.6399V12H20.1599V20.88Z"
        fill={color}
      />
    </svg>
  );
}

export default GraphGrowThin;
