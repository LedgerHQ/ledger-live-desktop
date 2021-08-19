import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ShoppingCartRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.9959 17.328V15.864H8.96395L8.57995 13.848H19.8599L21.8519 4.84798L6.80395 4.82398L6.39595 2.80798H2.14795V4.29598H5.09995L7.66795 17.328H18.9959ZM7.09195 6.31198H19.9319L18.6119 12.384H8.29195L7.09195 6.31198ZM7.23595 19.872C7.23595 20.568 7.81195 21.192 8.55595 21.192C9.25195 21.192 9.85195 20.568 9.85195 19.872C9.85195 19.152 9.25195 18.576 8.55595 18.576C7.81195 18.576 7.23595 19.152 7.23595 19.872ZM16.7399 19.872C16.7399 20.568 17.3159 21.192 18.0599 21.192C18.7799 21.192 19.3559 20.568 19.3559 19.872C19.3559 19.152 18.7799 18.576 18.0599 18.576C17.3159 18.576 16.7399 19.152 16.7399 19.872Z"
        fill={color}
      />
    </svg>
  );
}

export default ShoppingCartRegular;
