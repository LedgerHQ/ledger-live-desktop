import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function NetworkWiredMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.59991 21.3599H11.0399V15.3599H8.15991V12.8399H15.8399V15.3599H12.9599V21.3599H20.3999V15.3599H17.5199V12.8399H21.8399V11.1599H12.8399V8.63989H15.7199V2.63989H8.27991V8.63989H11.1599V11.1599H2.15991V12.8399H6.47991V15.3599H3.59991V21.3599ZM5.27991 19.6799V17.0399H9.35991V19.6799H5.27991ZM9.95991 6.95989V4.31989H14.0399V6.95989H9.95991ZM14.6399 19.6799V17.0399H18.7199V19.6799H14.6399Z"
        fill={color}
      />
    </svg>
  );
}

export default NetworkWiredMedium;
