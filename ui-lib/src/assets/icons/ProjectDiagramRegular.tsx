import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ProjectDiagramRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.9441 20.88H17.5681V14.256H12.1921L9.26414 9V7.104H14.7361V9.744H21.3601V3.12H14.7361V5.712H9.26414V3.12H2.64014V9.744H8.08814L10.9441 14.856V20.88ZM4.03214 8.352V4.488H7.89614V8.352H4.03214ZM12.3361 19.488V15.624H16.2001V19.488H12.3361ZM16.1281 8.352V4.488H19.9921V8.352H16.1281Z"
        fill={color}
      />
    </svg>
  );
}

export default ProjectDiagramRegular;
