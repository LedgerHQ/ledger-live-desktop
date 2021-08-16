import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function FourCircledFinaUltraLight({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.7241 11.856V13.656H8.00411L11.4601 8.472H11.7241V11.856ZM4.06812 21H10.9321C15.9721 21 19.9321 16.896 19.9321 12C19.9321 6.96 15.9721 3 10.9321 3H4.06812V3.84H10.9321C15.5161 3.84 19.0921 7.416 19.0921 12C19.0921 16.44 15.5161 20.16 10.9321 20.16H4.06812V21ZM7.18812 14.4H11.7241V16.464H12.5401V14.4H14.0041V13.656H12.5401V7.584H11.2201L7.18812 13.632V14.4Z"
        fill={color}
      />
    </svg>
  );
}

export default FourCircledFinaUltraLight;
