import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function NetworkWiredUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.59991 21.36H11.0399V15.36H7.70391V12.384H16.2959V15.36H12.9599V21.36H20.3999V15.36H17.0639V12.384H21.8399V11.616H12.3839V8.64H15.7199V2.64H8.27991V8.64H11.6159V11.616H2.15991V12.384H6.93591V15.36H3.59991V21.36ZM4.39191 20.592V16.128H10.2719V20.592H4.39191ZM9.07191 7.848V3.408H14.9519V7.848H9.07191ZM13.7519 20.592V16.128H19.6319V20.592H13.7519Z"
        fill={color}
      />
    </svg>
  );
}

export default NetworkWiredUltraLight;
