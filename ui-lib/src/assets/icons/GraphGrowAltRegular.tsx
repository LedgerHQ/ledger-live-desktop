import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function GraphGrowAltRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.27979 20.2319H20.9998V18.6959H3.83979V4.39194H2.27979V20.2319ZM5.47178 15.2639L10.3198 10.4639L13.1998 13.3439L20.3998 6.14394C20.3518 6.86394 20.3518 7.58394 20.3518 8.27994V9.93594H21.7198L21.6958 3.76794H15.5518V5.13594H17.2078C17.9038 5.13594 18.6238 5.13594 19.3198 5.11194L13.1998 11.2319L10.3198 8.35194L5.47178 13.1759V15.2639Z"
        fill={color}
      />
    </svg>
  );
}

export default GraphGrowAltRegular;
