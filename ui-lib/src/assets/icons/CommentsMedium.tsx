import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function CommentsMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.63989 4.77607V17.3041L7.10389 13.8961H17.5199V4.77607C17.5199 3.79207 16.7039 2.97607 15.7199 2.97607H4.43989C3.45589 2.97607 2.63989 3.79207 2.63989 4.77607ZM4.55989 13.5121V4.82407C4.55989 4.80007 4.58389 4.77607 4.60789 4.77607H15.5519C15.5759 4.77607 15.5999 4.80007 15.5999 4.82407V12.0961H6.43189L4.55989 13.5121ZM7.91989 15.8161C7.91989 16.8001 8.73589 17.6161 9.71989 17.6161H16.8959L21.3599 21.0241V8.73607C21.3599 7.70407 20.4959 6.81607 19.4399 6.81607V8.73607V9.21607V17.2321L17.5679 15.8161H10.3199H9.83989H7.91989Z"
        fill={color}
      />
    </svg>
  );
}

export default CommentsMedium;
