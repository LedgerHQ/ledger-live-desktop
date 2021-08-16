import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function ThreeCircledFinaThin({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.0642 16.68C12.8642 16.68 14.2082 15.6 14.2082 14.04C14.2082 13.008 13.6322 12.192 12.3362 11.856V11.808C13.5842 11.472 13.9442 10.704 13.9442 9.888C13.9442 8.4 12.7202 7.32 11.0882 7.32C9.31223 7.32 8.13623 8.568 8.13623 10.128V10.296H8.61623C8.61623 8.76 9.52823 7.8 11.0882 7.8C12.5282 7.8 13.4642 8.616 13.4642 9.888C13.4642 10.848 13.0322 11.592 10.8962 11.592H10.2962V12.072H10.8962C12.9842 12.072 13.7282 12.816 13.7282 14.04C13.7282 15.36 12.6962 16.2 11.0642 16.2C9.31223 16.2 8.47223 15.24 8.47223 13.56H7.99223V13.68C7.99223 15.408 9.09623 16.68 11.0642 16.68ZM4.03223 20.88H11.0882C16.0562 20.88 19.9682 16.848 19.9682 12C19.9682 7.032 16.0562 3.12 11.0882 3.12H4.03223V3.6H11.0882C15.7922 3.6 19.4882 7.296 19.4882 12C19.4882 16.584 15.7922 20.4 11.0882 20.4H4.03223V20.88Z"
        fill={color}
      />
    </svg>
  );
}

export default ThreeCircledFinaThin;
