import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function RewardsUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.2799 17.844H18.7199V17.076H16.4399C18.5759 15.66 19.9199 13.284 19.9199 10.62C19.9199 6.252 16.3679 2.7 11.9999 2.7C7.6319 2.7 4.0799 6.252 4.0799 10.62C4.0799 13.284 5.3999 15.636 7.5359 17.076H5.2799V17.844ZM2.3999 21.3H21.5999V14.94H20.7599V20.484H3.2399V14.94H2.3999V21.3ZM4.9199 10.62C4.9199 6.708 8.0879 3.54 11.9999 3.54C15.9119 3.54 19.0799 6.708 19.0799 10.62C19.0799 13.572 17.2559 16.092 14.7119 17.076H9.3119C6.7439 16.092 4.9199 13.572 4.9199 10.62Z"
        fill={color}
      />
    </svg>
  );
}

export default RewardsUltraLight;
