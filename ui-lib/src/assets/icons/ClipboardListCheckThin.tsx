import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ClipboardListCheckThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.31982 20.88H19.6798V4.56H15.8398V3.12H8.15982V4.56H4.31982V20.88ZM4.79982 20.4V5.04H8.15982V6H15.8398V5.04H19.1998V20.4H4.79982ZM6.86382 9.6L8.66382 11.424L11.4718 8.616L11.1358 8.28L8.66382 10.752L7.19982 9.264L6.86382 9.6ZM7.91982 16.968H9.35982V15.528H7.91982V16.968ZM11.7598 16.488H16.9198V16.008H11.7598V16.488ZM13.1998 10.968H16.9198V10.488H13.1998V10.968Z"
        fill={color}
      />
    </svg>
  );
}

export default ClipboardListCheckThin;
