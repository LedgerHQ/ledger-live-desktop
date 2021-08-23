import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function UndelegateUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.18411 9.09599L20.7361 21.648L21.3121 21.072L2.59211 2.35199L2.01611 2.92799L7.58411 8.49599C6.79211 9.45599 6.31211 10.68 6.31211 12V20.4H7.15211V12C7.15211 10.872 7.51211 9.88799 8.18411 9.09599ZM10.5121 6.74399L11.2321 7.48799C11.3761 7.46399 11.5441 7.46399 11.6881 7.46399H20.5201C19.9201 8.03999 19.3441 8.61599 18.7681 9.19199L17.0881 10.848L17.6401 11.4L21.9841 7.05599L17.6401 2.71199L17.0881 3.26399L18.7681 4.91999C19.3201 5.49599 19.9201 6.07199 20.4961 6.64799H11.6641C11.2561 6.64799 10.8721 6.67199 10.5121 6.74399Z"
        fill={color}
      />
    </svg>
  );
}

export default UndelegateUltraLight;
