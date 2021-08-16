import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function FeesMedium({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.31986 12.8879H13.3199V11.0879H7.31986V12.8879ZM3.35986 11.9999C3.35986 17.4719 6.26386 22.3199 10.4399 22.3199H13.6319C17.7119 22.3199 20.6399 17.5439 20.6399 11.9999C20.6399 6.45593 17.7119 1.67993 13.6319 1.67993H10.4399C6.26386 1.67993 3.35986 6.52793 3.35986 11.9999ZM5.27986 11.9999C5.27986 7.36793 7.58386 3.59993 10.4399 3.59993C13.2239 3.59993 15.5759 7.36793 15.5759 11.9999C15.5759 16.6319 13.2239 20.3999 10.4399 20.3999C7.58386 20.3999 5.27986 16.6319 5.27986 11.9999ZM14.1119 20.3519C15.9599 18.5759 17.1359 15.4559 17.1359 11.9999C17.1359 8.54393 15.9599 5.42393 14.1119 3.64793C16.6799 4.03193 18.7199 7.63193 18.7199 11.9999C18.7199 16.3679 16.6799 19.9679 14.1119 20.3519Z"
        fill={color}
      />
    </svg>
  );
}

export default FeesMedium;
