import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function CommentsRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.63989 4.83601V17.316L6.93589 14.004H17.5919V4.83601C17.5919 3.85201 16.7519 3.03601 15.7919 3.03601H4.43989C3.45589 3.03601 2.63989 3.85201 2.63989 4.83601ZM4.19989 14.22V4.86001C4.19989 4.66801 4.36789 4.50001 4.55989 4.50001H15.6479C15.8639 4.50001 16.0319 4.66801 16.0319 4.86001V12.54H6.38389L4.19989 14.22ZM7.79989 15.876C7.79989 16.86 8.61589 17.676 9.59989 17.676H17.0639L21.3599 20.964V8.74801C21.3599 7.71601 20.4959 6.85201 19.4639 6.85201V8.41201C19.6559 8.41201 19.7999 8.65201 19.7999 9.10801V17.892L17.6159 16.212H10.0559C9.50389 16.212 9.35989 16.044 9.35989 15.876H7.79989Z"
        fill={color}
      />
    </svg>
  );
}

export default CommentsRegular;
