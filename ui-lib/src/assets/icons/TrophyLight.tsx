import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function TrophyLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.95989 20.4H17.0399V19.248H12.6239V15.96C14.2559 15.888 15.5519 15.288 16.4879 14.064C16.8959 13.56 17.1839 13.008 17.3519 12.312C18.6959 12.216 19.7039 11.64 20.4719 10.656C21.0959 9.86398 21.3599 8.85598 21.3599 7.36798V4.51198H17.5679V3.59998H6.43189V4.51198H2.63989V7.36798C2.63989 8.85598 2.90389 9.86398 3.52789 10.656C4.29589 11.64 5.30389 12.216 6.67189 12.312C6.83989 12.984 7.12789 13.56 7.53589 14.064C8.49589 15.288 9.74389 15.888 11.3759 15.96V19.248H6.95989V20.4ZM3.83989 7.89598V5.63998H6.43189V10.08C6.43189 10.488 6.45589 10.848 6.50389 11.16C4.70389 11.04 3.83989 9.93598 3.83989 7.89598ZM7.70389 10.8V4.72798H16.3199V10.8C16.3199 13.368 15.2159 14.736 12.6239 14.736H11.3999C8.85589 14.736 7.70389 13.368 7.70389 10.8ZM17.4959 11.16C17.5439 10.848 17.5679 10.488 17.5679 10.08V5.63998H20.1599V7.89598C20.1599 10.32 18.9599 11.064 17.4959 11.16Z"
        fill={color}
      />
    </svg>
  );
}

export default TrophyLight;
