import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function PhoneLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.0119 21.372L21.3719 17.916L15.9959 13.092L11.7479 17.244C10.8119 16.572 9.89993 15.804 9.05993 14.94C8.21993 14.1 7.42793 13.188 6.75593 12.252L10.9079 8.00399L6.08393 2.62799L2.62793 5.98799C3.34793 9.56399 5.48393 13.044 8.21993 15.78C10.9799 18.54 14.4119 20.676 18.0119 21.372ZM3.94793 6.37199L6.03593 4.35599L9.27593 7.95599L6.05993 11.22C5.09993 9.70799 4.35593 8.07599 3.94793 6.37199ZM12.7799 17.94L16.0439 14.724L19.6439 17.964L17.6279 20.052C15.9239 19.644 14.2919 18.924 12.7799 17.94Z"
        fill={color}
      />
    </svg>
  );
}

export default PhoneLight;
