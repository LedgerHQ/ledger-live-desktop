import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function FiveCircledFinaUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.9321 16.704C12.8521 16.704 14.0761 15.384 14.0761 13.608C14.0761 11.808 12.8281 10.536 11.1001 10.536C10.2121 10.536 9.49212 10.896 9.03611 11.496H8.94011L9.27611 8.352H13.5721V7.584H8.58011L8.10011 12.744H8.89212C9.18011 11.856 9.82811 11.28 10.9561 11.28H11.0041C12.4201 11.28 13.2361 12.12 13.2361 13.512V13.704C13.2361 15.096 12.4681 15.936 10.9561 15.936H10.9081C9.39611 15.936 8.62811 15.072 8.60412 13.752H7.78812C7.78812 15.408 9.01212 16.704 10.9321 16.704ZM4.06812 21H10.9321C15.9721 21 19.9321 16.896 19.9321 12C19.9321 6.96 15.9721 3 10.9321 3H4.06812V3.84H10.9321C15.5161 3.84 19.0921 7.416 19.0921 12C19.0921 16.44 15.5161 20.16 10.9321 20.16H4.06812V21Z"
        fill={color}
      />
    </svg>
  );
}

export default FiveCircledFinaUltraLight;
