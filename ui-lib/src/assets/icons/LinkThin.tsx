import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function LinkThin({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.4882 13.5123C12.0002 15.0963 14.5682 15.0963 16.0802 13.5123L19.7042 9.88827C21.2882 8.37627 21.2642 5.80827 19.7042 4.29627C18.1922 2.73627 15.6242 2.71227 14.1122 4.29627L11.4242 6.96027L11.7602 7.29627L14.4482 4.63227C15.7922 3.24027 18.0242 3.26427 19.3682 4.63227C20.7362 5.97627 20.7602 8.20827 19.3682 9.55227L15.7442 13.1763C14.4002 14.5683 12.1682 14.5683 10.8242 13.1763L10.0322 12.4323L9.69621 12.7923L10.4882 13.5123ZM4.2962 19.7043C5.8082 21.2643 8.3762 21.2883 9.88821 19.7043L12.5762 17.0403L12.2402 16.7043L9.55221 19.3683C8.2082 20.7603 5.9762 20.7363 4.6322 19.3683C3.2642 18.0243 3.2402 15.7923 4.6322 14.4483L8.25621 10.8243C9.60021 9.43227 11.8322 9.43227 13.1762 10.8243L13.9682 11.5683L14.3042 11.2083L13.5122 10.4883C12.0002 8.90427 9.43221 8.90427 7.92021 10.4883L4.2962 14.1123C2.7122 15.6243 2.7362 18.1923 4.2962 19.7043Z"
        fill={color}
      />
    </svg>
  );
}

export default LinkThin;
