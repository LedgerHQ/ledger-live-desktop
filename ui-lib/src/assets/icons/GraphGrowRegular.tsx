import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function GraphGrowRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.83211 14.832L7.77611 9.864H15.4801L19.8721 5.496C19.8481 6.216 19.8481 6.936 19.8481 7.632V9.288H21.1921V3.12H15.0481V4.488H16.6801C17.3761 4.488 18.0961 4.488 18.7921 4.464L14.8561 8.4H7.20011L2.83211 12.744V14.832ZM2.80811 20.88H4.46411V17.952H2.80811V20.88ZM6.98411 20.88H8.64011V16.056H6.98411V20.88ZM11.1841 20.88H12.8161V12.96H11.1841V20.88ZM15.3601 20.88H17.0161V15.12H15.3601V20.88ZM19.5121 20.88H21.1681V12H19.5121V20.88Z"
        fill={color}
      />
    </svg>
  );
}

export default GraphGrowRegular;
