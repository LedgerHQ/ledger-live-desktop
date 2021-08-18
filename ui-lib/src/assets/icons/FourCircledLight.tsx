import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function FourCircledLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.9999 21.12C17.1119 21.12 21.1199 16.968 21.1199 12C21.1199 6.912 17.0879 2.88 11.9999 2.88C6.91188 2.88 2.87988 6.912 2.87988 12C2.87988 17.088 6.91188 21.12 11.9999 21.12ZM4.07988 12C4.07988 7.56 7.55988 4.08 11.9999 4.08C16.4399 4.08 19.9199 7.56 19.9199 12C19.9199 16.32 16.4399 19.92 11.9999 19.92C7.55988 19.92 4.07988 16.44 4.07988 12ZM8.13588 14.496H12.5039V16.464H13.6319V14.496H15.0719V13.464H13.6319V7.584H12.0719L8.13588 13.512V14.496ZM9.26388 13.464L12.3359 8.88H12.5279C12.5039 9.86401 12.5039 10.968 12.5039 12.024V13.464H9.26388Z"
        fill={color}
      />
    </svg>
  );
}

export default FourCircledLight;
