import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function LockAltRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.2199 17.4959H12.7799V13.4159H11.2199V17.4959ZM4.69189 21.3359H19.3079V9.62394H17.3399V7.91994C17.3399 5.01594 14.8919 2.66394 11.9879 2.66394C9.08389 2.66394 6.65989 5.01594 6.65989 7.91994V9.62394H4.69189V21.3359ZM6.25189 19.8719V11.1119H17.7479V19.8719H6.25189ZM8.21989 9.62394V7.91994C8.21989 5.85594 9.89989 4.15194 11.9879 4.15194C14.0759 4.15194 15.7799 5.85594 15.7799 7.91994V9.62394H8.21989Z"
        fill={color}
      />
    </svg>
  );
}

export default LockAltRegular;
