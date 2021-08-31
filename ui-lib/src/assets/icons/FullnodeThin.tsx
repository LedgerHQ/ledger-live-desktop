import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function FullnodeThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.9999 21.12C16.3679 21.12 19.7039 19.872 19.7039 17.904V6.072C19.7039 4.104 16.4879 2.88 11.9999 2.88C7.6319 2.88 4.2959 4.104 4.2959 6.072V17.904C4.2959 19.872 7.5599 21.12 11.9999 21.12ZM4.7759 17.904V15.192C5.8319 16.44 8.5679 17.208 11.9999 17.208C15.3839 17.208 18.1439 16.44 19.2239 15.168V17.904C19.2239 19.488 16.2719 20.64 11.9999 20.64C7.6559 20.64 4.7759 19.488 4.7759 17.904ZM4.7759 13.968V11.256C5.8319 12.528 8.5679 13.296 11.9999 13.296C15.3839 13.296 18.1439 12.528 19.2239 11.232V13.968C19.2239 15.528 16.2719 16.728 11.9999 16.728C7.6559 16.728 4.7759 15.528 4.7759 13.968ZM4.7759 10.008V7.32C5.8319 8.592 8.5679 9.31201 11.9999 9.31201C15.3839 9.31201 18.1439 8.56801 19.2239 7.296V10.008C19.2239 11.616 16.2719 12.816 11.9999 12.816C7.6559 12.816 4.7759 11.616 4.7759 10.008ZM4.7759 6.072C4.7759 4.488 7.7279 3.36 11.9999 3.36C16.3919 3.36 19.2239 4.488 19.2239 6.072C19.2239 7.704 16.2719 8.83201 11.9999 8.83201C7.6559 8.83201 4.7759 7.704 4.7759 6.072Z"
        fill={color}
      />
    </svg>
  );
}

export default FullnodeThin;
