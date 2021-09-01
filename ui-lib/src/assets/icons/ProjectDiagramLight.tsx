import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ProjectDiagramLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.9441 20.88H17.5681V14.256H11.9041L9.26414 9.144V6.936H14.7361V9.744H21.3601V3.12H14.7361V5.856H9.26414V3.12H2.64014V9.744H8.35214L10.9441 14.736V20.88ZM3.72014 8.664V4.2H8.18414V8.664H3.72014ZM12.0241 19.8V15.336H16.4881V19.8H12.0241ZM15.8161 8.664V4.2H20.2801V8.664H15.8161Z"
        fill={color}
      />
    </svg>
  );
}

export default ProjectDiagramLight;
