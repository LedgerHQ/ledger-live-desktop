import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function SevenCircledFinaThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.76823 16.44H10.2962C10.6802 13.176 12.0482 10.464 14.2082 8.64V7.584H7.84823V8.064H13.7282V8.424C11.4962 10.392 10.1522 13.2 9.76823 16.44ZM4.03223 20.88H11.0882C16.0562 20.88 19.9682 16.848 19.9682 12C19.9682 7.032 16.0562 3.12 11.0882 3.12H4.03223V3.6H11.0882C15.7922 3.6 19.4882 7.296 19.4882 12C19.4882 16.584 15.7922 20.4 11.0882 20.4H4.03223V20.88Z"
        fill={color}
      />
    </svg>
  );
}

export default SevenCircledFinaThin;
