import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function ProjectDiagramMedium({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.9441 20.8801H17.5681V14.2561H12.4561L9.26414 8.85612V7.24812H14.7361V9.74412H21.3601V3.12012H14.7361V5.56812H9.26414V3.12012H2.64014V9.74412H7.84814L10.9441 14.9761V20.8801ZM4.32014 8.06412V4.80012H7.58414V8.06412H4.32014ZM12.6241 19.2001V15.9361H15.8881V19.2001H12.6241ZM16.4161 8.06412V4.80012H19.6801V8.06412H16.4161Z"
        fill={color}
      />
    </svg>
  );
}

export default ProjectDiagramMedium;
