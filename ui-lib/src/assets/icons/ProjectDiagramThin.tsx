import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ProjectDiagramThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.9441 20.88H17.5681V14.256H11.3521L9.26414 9.456V6.648H14.7361V9.744H21.3601V3.12H14.7361V6.168H9.26414V3.12H2.64014V9.744H8.85614L10.9441 14.496V20.88ZM3.12014 9.264V3.6H8.78414V9.264H3.12014ZM11.4241 20.4V14.736H17.0881V20.4H11.4241ZM15.2161 9.264V3.6H20.8801V9.264H15.2161Z"
        fill={color}
      />
    </svg>
  );
}

export default ProjectDiagramThin;
