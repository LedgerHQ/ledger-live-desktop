import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function UserSecretLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.60791 19.416V21.36H19.3919V19.416C19.3919 17.184 18.3839 15.36 16.5599 14.544V11.112H7.46391V14.544C5.63991 15.384 4.60791 17.184 4.60791 19.416ZM5.75991 7.44001H9.52791C9.04791 7.65601 8.73591 8.11202 8.73591 8.66402C8.73591 9.38402 9.33591 10.008 10.0799 10.008C10.8239 10.008 11.4479 9.38402 11.4479 8.66402C11.4479 8.11202 11.1119 7.65601 10.6319 7.44001H13.3439C12.8639 7.65601 12.5519 8.11202 12.5519 8.66402C12.5519 9.38402 13.1519 10.008 13.9199 10.008C14.6399 10.008 15.2639 9.38402 15.2639 8.66402C15.2639 8.11202 14.9279 7.65601 14.4719 7.44001H18.2399V6.28801H15.9599V4.17601C15.9599 3.31201 15.2879 2.64001 14.4239 2.64001H9.57591C8.71191 2.64001 8.03991 3.31201 8.03991 4.17601V6.28801H5.75991V7.44001ZM5.87991 20.208V18.816C5.87991 16.92 6.76791 15.792 8.59191 15.36V12.192H11.4959V20.208H5.87991ZM9.11991 6.28801V4.27201C9.11991 3.93601 9.33591 3.72001 9.67191 3.72001H14.3279C14.6639 3.72001 14.8799 3.93601 14.8799 4.27201V6.28801H9.11991ZM12.5039 20.208V12.192H15.4079V15.36C17.2319 15.768 18.1439 16.92 18.1439 18.816V20.208H12.5039Z"
        fill={color}
      />
    </svg>
  );
}

export default UserSecretLight;
