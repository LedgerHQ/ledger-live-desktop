// @flow

import React from "react";

const AccountSettings = ({ size, dot }: { size: number, dot: boolean }) => (
  <svg
    height={size + 2}
    width={size}
    viewBox="0 0 16 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <mask
      id="bell-mask0"
      mask-type="alpha"
      maskUnits="userSpaceOnUse"
      x="0"
      y="2"
      width="16"
      height="16"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 7.74284C15.0491 8.52818 13.8296 9 12.5 9C9.46243 9 7 6.53757 7 3.5C7 2.97999 7.07217 2.47683 7.20703 2H0V18H16V7.74284Z"
        fill="#C4C4C4"
      />
    </mask>
    <g mask={dot ? "url(#bell-mask0)" : undefined}>
      <path
        d="M14.7188 13.3438C14.125 12.6875 12.9688 11.7188 12.9688 8.5C12.9688 6.09375 11.2812 4.15625 8.96875 3.65625V3C8.96875 2.46875 8.53125 2 8 2C7.4375 2 7 2.46875 7 3V3.65625C4.6875 4.15625 3 6.09375 3 8.5C3 11.7188 1.84375 12.6875 1.25 13.3438C1.0625 13.5312 0.96875 13.7812 1 14C1 14.5312 1.375 15 2 15H13.9688C14.5938 15 14.9688 14.5312 15 14C15 13.7812 14.9062 13.5312 14.7188 13.3438ZM3.09375 13.5C3.75 12.6562 4.46875 11.1875 4.5 8.53125C4.5 8.53125 4.5 8.53125 4.5 8.5C4.5 6.59375 6.0625 5 8 5C9.90625 5 11.5 6.59375 11.5 8.5C11.5 8.53125 11.4688 8.53125 11.4688 8.53125C11.5 11.1875 12.2188 12.6562 12.875 13.5H3.09375ZM8 18C9.09375 18 9.96875 17.125 9.96875 16H6C6 17.125 6.875 18 8 18Z"
        fill="currentColor"
      />
    </g>
    {dot ? <circle cx="12.5" cy="3.5" r="3.5" fill="#EA2E49" /> : null}
  </svg>
);

export default AccountSettings;
