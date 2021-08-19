import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function FolderLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.87988 20.16H21.1199V5.68803H11.9999L10.8239 4.51203C10.3439 4.03203 9.86388 3.84003 9.16788 3.84003H2.87988V20.16ZM4.07988 19.008V10.104H19.9199V19.008H4.07988ZM4.07988 8.95203V4.96803H9.16788C9.55188 4.96803 9.69588 5.04003 9.98388 5.32803L11.4959 6.81603H19.9199V8.95203H4.07988Z"
        fill={color}
      />
    </svg>
  );
}

export default FolderLight;
