import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function NetworkWiredLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.59991 21.36H11.0399V15.36H7.87191V12.528H16.1519V15.36H12.9599V21.36H20.3999V15.36H17.2319V12.528H21.8399V11.448H12.5519V8.64002H15.7199V2.64001H8.27991V8.64002H11.4719V11.448H2.15991V12.528H6.79191V15.36H3.59991V21.36ZM4.67991 20.28V16.44H9.95991V20.28H4.67991ZM9.35991 7.56002V3.72001H14.6399V7.56002H9.35991ZM14.0399 20.28V16.44H19.3199V20.28H14.0399Z"
        fill={color}
      />
    </svg>
  );
}

export default NetworkWiredLight;
