import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function MapMarkerLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.85994 16.344L11.9879 21.888L16.1159 16.344C17.7959 14.088 19.1639 11.832 19.1639 9.384C19.1159 4.896 15.6839 2.112 11.9879 2.112C8.29194 2.112 4.85994 4.896 4.83594 9.384C4.83594 11.832 6.17994 14.088 7.85994 16.344ZM6.03594 9.384C6.05994 5.592 8.91594 3.312 11.9879 3.312C15.0839 3.312 17.9399 5.592 17.9639 9.384C17.9639 11.448 16.7639 13.464 15.1559 15.624L11.9879 19.872L8.84394 15.624C7.21194 13.464 6.03594 11.448 6.03594 9.384ZM8.62794 9.312C8.62794 11.16 10.1399 12.672 11.9879 12.672C13.8599 12.672 15.3479 11.16 15.3479 9.312C15.3479 7.44 13.8599 5.952 11.9879 5.952C10.1399 5.952 8.62794 7.44 8.62794 9.312ZM9.70794 9.312C9.70794 8.04 10.7399 7.032 11.9879 7.032C13.2599 7.032 14.2679 8.04 14.2679 9.312C14.2679 10.56 13.2599 11.592 11.9879 11.592C10.7399 11.592 9.70794 10.56 9.70794 9.312Z"
        fill={color}
      />
    </svg>
  );
}

export default MapMarkerLight;
