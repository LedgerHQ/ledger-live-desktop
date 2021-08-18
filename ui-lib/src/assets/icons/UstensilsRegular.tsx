import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function UstensilsRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.10399 11.88V21.84H8.66399V11.88C10.56 11.52 11.976 9.84003 11.976 7.92003V2.40003H10.512V7.92003C10.512 9.19203 9.76799 10.176 8.66399 10.464V2.40003H7.10399V10.464C5.99999 10.176 5.25599 9.19203 5.25599 7.92003V2.40003H3.79199V7.92003C3.79199 9.84003 5.20799 11.52 7.10399 11.88ZM14.016 16.8H18.648V21.84H20.208V2.16003C16.776 2.16003 14.016 4.89603 14.016 8.32803V16.8ZM15.576 15.408V8.32803C15.576 6.04803 16.776 4.36803 18.648 3.81603V15.408H15.576Z"
        fill={color}
      />
    </svg>
  );
}

export default UstensilsRegular;
