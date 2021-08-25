import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ManagerThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.83986 20.172V13.692H10.3199V20.172H3.83986ZM3.35986 20.652H10.7999V13.212H3.35986V20.652ZM3.35986 10.788H10.7999V3.34802H3.35986V10.788ZM3.83986 10.308V3.82802H10.3199V10.308H3.83986ZM13.1999 20.652H20.6399V13.212H13.1999V20.652ZM13.1999 10.812H20.6399V3.37202H13.1999V10.812ZM13.6799 20.172V13.692H20.1599V20.172H13.6799ZM13.6799 10.332V3.85202H20.1599V10.332H13.6799Z"
        fill={color}
      />
    </svg>
  );
}

export default ManagerThin;
