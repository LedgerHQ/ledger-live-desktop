import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function WalletAddLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.1198 19.56H21.2398V6.59999H6.47977V7.72799H20.0398V18.408H12.1198V19.56ZM2.75977 17.256H6.26377V20.76H7.41577V17.256H10.9198V16.104H7.41577V12.6H6.26377V16.104H2.75977V17.256ZM2.99977 11.64H4.15177V5.15999C4.15177 4.63199 4.41577 4.36799 4.91977 4.36799H19.2478C19.0558 3.69599 18.4318 3.23999 17.6398 3.23999H4.91977C3.81577 3.23999 2.99977 4.05599 2.99977 5.15999V11.64ZM15.3838 13.176C15.3838 13.752 15.8638 14.256 16.4638 14.256C17.0158 14.256 17.4958 13.752 17.4958 13.176C17.4958 12.624 17.0158 12.144 16.4638 12.144C15.8638 12.144 15.3838 12.624 15.3838 13.176Z"
        fill={color}
      />
    </svg>
  );
}

export default WalletAddLight;
