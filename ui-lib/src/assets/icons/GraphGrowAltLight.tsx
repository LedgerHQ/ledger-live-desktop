import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function GraphGrowAltLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.3999 20.232H21.1199V19.056H3.5999V4.39201H2.3999V20.232ZM5.1839 15.216L10.1999 10.224L13.0799 13.104L20.5679 5.61601C20.5439 6.48001 20.5199 7.32001 20.5199 8.16001V9.93601H21.5999V3.76801H15.4559V4.84801H17.2319C18.0479 4.84801 18.8879 4.84801 19.7279 4.82401L13.0799 11.472L10.1999 8.59201L5.1839 13.608V15.216Z"
        fill={color}
      />
    </svg>
  );
}

export default GraphGrowAltLight;
