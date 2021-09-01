import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function FolderMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.63989 20.4001H21.3599V5.4481H11.9999L10.8239 4.2721C10.3439 3.7921 9.86389 3.6001 9.16789 3.6001H2.63989V20.4001ZM4.55989 18.6001V10.8961H19.4399V18.6001H4.55989ZM4.55989 9.0961V5.4001H9.16789C9.31189 5.4001 9.31189 5.4001 9.45589 5.5441L11.1599 7.2481H19.4399V9.0961H4.55989Z"
        fill={color}
      />
    </svg>
  );
}

export default FolderMedium;
