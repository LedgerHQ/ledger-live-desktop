import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function OneCircledFinaUltraLight({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.3641 12.312V16.464H12.2041V7.584H10.6921L7.54812 10.512V11.568L10.8361 8.496H11.3641V12.312ZM4.06812 21H10.9321C15.9721 21 19.9321 16.896 19.9321 12C19.9321 6.96 15.9721 3 10.9321 3H4.06812V3.84H10.9321C15.5161 3.84 19.0921 7.416 19.0921 12C19.0921 16.44 15.5161 20.16 10.9321 20.16H4.06812V21Z"
        fill={color}
      />
    </svg>
  );
}

export default OneCircledFinaUltraLight;
