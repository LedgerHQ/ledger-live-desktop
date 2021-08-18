import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function FiltersLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.90391 21.36V16.752H8.39991V15.552H2.15991V16.752H4.65591V21.36H5.90391ZM4.65591 13.632H5.90391V2.64001H4.65591V13.632ZM8.87991 8.40002H15.1199V7.20002H12.6239V2.64001H11.3759V7.20002H8.87991V8.40002ZM11.3759 21.36H12.6239V10.32H11.3759V21.36ZM15.5999 16.752H18.0959V21.36H19.3439V16.752H21.8399V15.552H15.5999V16.752ZM18.0959 13.632H19.3439V2.64001H18.0959V13.632Z"
        fill={color}
      />
    </svg>
  );
}

export default FiltersLight;
