import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function FourCircledFinaMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.344 12.4079V13.1039H8.11195L10.368 9.69589H10.392C10.368 10.4879 10.344 11.4959 10.344 12.4079ZM4.19995 21.3599H10.44C15.696 21.3599 19.7999 17.0879 19.7999 11.9999C19.7999 6.76789 15.672 2.63989 10.44 2.63989H4.19995V4.55989H10.44C14.616 4.55989 17.88 7.82389 17.88 11.9999C17.88 16.0559 14.616 19.4399 10.44 19.4399H4.19995V21.3599ZM6.33595 14.6639H10.344V16.4639H12.144V14.6639H13.512V13.1039H12.144V7.58389H10.128L6.33595 13.2959V14.6639Z"
        fill={color}
      />
    </svg>
  );
}

export default FourCircledFinaMedium;
