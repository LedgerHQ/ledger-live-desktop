import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function SevenCircledFinaMedium({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.5442 16.4639H10.7522C10.9682 13.4399 11.9522 11.0639 13.8962 9.09589V7.58389H7.0802V9.23989H11.5682V9.55189C9.79219 11.7839 8.83219 13.9919 8.5442 16.4639ZM4.2002 21.3599H10.4402C15.6962 21.3599 19.8002 17.0879 19.8002 11.9999C19.8002 6.76789 15.6722 2.63989 10.4402 2.63989H4.2002V4.55989H10.4402C14.6162 4.55989 17.8802 7.82389 17.8802 11.9999C17.8802 16.0559 14.6162 19.4399 10.4402 19.4399H4.2002V21.3599Z"
        fill={color}
      />
    </svg>
  );
}

export default SevenCircledFinaMedium;
