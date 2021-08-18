import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function TwitchLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.56012 21.792L11.2801 18.312H14.2081L20.8801 12V2.20801H6.84012L3.12012 5.68801V18.312H7.56012V21.792ZM7.56012 14.088V3.62401H19.3681V11.328L16.4401 14.088H13.5121L10.8961 16.56V14.088H7.56012ZM11.6161 10.368H13.1041V6.12001H11.6161V10.368ZM15.6721 10.368H17.1601V6.12001H15.6721V10.368Z"
        fill={color}
      />
    </svg>
  );
}

export default TwitchLight;
