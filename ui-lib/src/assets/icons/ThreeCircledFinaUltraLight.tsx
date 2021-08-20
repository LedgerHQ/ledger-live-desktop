import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ThreeCircledFinaUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.9079 16.68C12.7799 16.68 14.1479 15.576 14.1479 14.016C14.1479 13.008 13.5719 12.192 12.3959 11.88V11.76C13.4999 11.448 13.8839 10.704 13.8839 9.888C13.8839 8.424 12.6119 7.32 10.9319 7.32C9.13187 7.32 7.88387 8.568 7.88387 10.128V10.296H8.72387C8.72387 8.88 9.46787 8.088 10.9319 8.088C12.2999 8.088 13.0439 8.76 13.0439 9.936C13.0439 10.896 12.6839 11.472 10.8359 11.472H10.1399V12.24H10.8359C12.6839 12.24 13.3079 12.864 13.3079 13.992C13.3079 15.216 12.4679 15.888 10.9079 15.888C9.27587 15.888 8.57987 15.12 8.57987 13.56H7.73987V13.68C7.73987 15.408 8.93987 16.68 10.9079 16.68ZM4.06787 21H10.9319C15.9719 21 19.9319 16.896 19.9319 12C19.9319 6.96 15.9719 3 10.9319 3H4.06787V3.84H10.9319C15.5159 3.84 19.0919 7.416 19.0919 12C19.0919 16.44 15.5159 20.16 10.9319 20.16H4.06787V21Z"
        fill={color}
      />
    </svg>
  );
}

export default ThreeCircledFinaUltraLight;
