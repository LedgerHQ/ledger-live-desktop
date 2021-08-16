import React from "react";

const CheckMarkIcon = ({
  color = "white",
  ...props
}: React.HTMLAttributes<SVGElement> & { color?: string }): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="10"
    viewBox="0 0 12 10"
    fill="none"
    {...props}
  >
    <path
      d="M10.4284 0.994791L3.92187 7.5013L1.54687 5.10156C1.42318 5.0026 1.22526 5.0026 1.1263 5.10156L0.408854 5.81901C0.309896 5.91797 0.309896 6.11589 0.408854 6.23958L3.72396 9.52995C3.84766 9.65365 4.02083 9.65365 4.14453 9.52995L11.5664 2.10807C11.6654 2.00911 11.6654 1.8112 11.5664 1.6875L10.849 0.994791C10.75 0.871094 10.5521 0.871094 10.4284 0.994791Z"
      fill={color}
    />
  </svg>
);

export default CheckMarkIcon;
