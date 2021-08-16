import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function ListUltraLight({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.90007 6.888H21.1801V6.048H6.90007V6.888ZM2.82007 18.36H4.50007V16.68H2.82007V18.36ZM2.82007 12.84H4.50007V11.16H2.82007V12.84ZM2.82007 7.32H4.50007V5.64H2.82007V7.32ZM6.90007 17.928H21.1801V17.088H6.90007V17.928ZM6.90007 12.408H21.1801V11.568H6.90007V12.408Z"
        fill={color}
      />
    </svg>
  );
}

export default ListUltraLight;
