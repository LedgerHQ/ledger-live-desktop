import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function FolderUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 20.04H21V5.808H12L10.824 4.632C10.344 4.152 9.864 3.96 9.168 3.96H3V20.04ZM3.84 19.224V9.696H20.16V19.224H3.84ZM3.84 8.88V4.776H9.168C9.648 4.776 9.888 4.848 10.224 5.208L11.64 6.624H20.16V8.88H3.84Z"
        fill={color}
      />
    </svg>
  );
}

export default FolderUltraLight;
