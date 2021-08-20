import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function BringFrontThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.9601 20.88H20.8801V12.96H18.3601V13.44H20.4001V20.4H13.4401V18.36H12.9601V20.88ZM3.12012 11.04H5.64012V10.56H3.60012V3.6H11.0401V5.64H11.5201V3.12H3.12012V11.04ZM8.04012 15.96H15.9601V8.04H8.04012V15.96ZM8.52012 15.48V8.52H15.4801V15.48H8.52012Z"
        fill={color}
      />
    </svg>
  );
}

export default BringFrontThin;
