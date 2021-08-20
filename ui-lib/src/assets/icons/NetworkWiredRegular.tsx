import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function NetworkWiredRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.59991 21.36H11.0399V15.36H8.01591V12.696H15.9839V15.36H12.9599V21.36H20.3999V15.36H17.3759V12.696H21.8399V11.304H12.6959V8.64002H15.7199V2.64001H8.27991V8.64002H11.3039V11.304H2.15991V12.696H6.62391V15.36H3.59991V21.36ZM4.99191 19.968V16.728H9.67191V19.968H4.99191ZM9.67191 7.24801V4.00801H14.3519V7.24801H9.67191ZM14.3519 19.968V16.728H19.0319V19.968H14.3519Z"
        fill={color}
      />
    </svg>
  );
}

export default NetworkWiredRegular;
