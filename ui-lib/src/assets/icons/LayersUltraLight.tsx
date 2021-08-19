import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function LayersUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.9999 12.024L21.5999 7.488L11.9999 3L2.3999 7.488L11.9999 12.024ZM2.3999 16.488L11.9999 21L21.5999 16.488L19.1759 15.312L18.3359 15.696L19.8239 16.416L11.9999 20.088L4.1759 16.416L5.6639 15.696L4.8479 15.312L2.3999 16.488ZM2.3999 12L11.9999 16.512L21.5999 12L19.1759 10.824L18.3359 11.208L19.8239 11.928L11.9999 15.6L4.1759 11.928L5.6639 11.208L4.8479 10.824L2.3999 12ZM4.3199 7.488L11.9999 3.912L19.6799 7.488L11.9999 11.112L4.3199 7.488Z"
        fill={color}
      />
    </svg>
  );
}

export default LayersUltraLight;
