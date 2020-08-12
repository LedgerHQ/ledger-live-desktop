// @flow

import React from "react";

const Book = ({ size, color = "currentColor" }: { size: number, color?: string }) => (
  <svg viewBox="0 0 16 16" height={size} width={size}>
    <path
      fill={color}
      clipRule="evenodd"
      fillRule="evenodd"
      d="M1.333 1.25a.75.75 0 00-.75.75v10c0 .414.336.75.75.75H6A1.25 1.25 0 017.25 14a.75.75 0 001.5 0A1.25 1.25 0 0110 12.75h4.667a.75.75 0 00.75-.75V2a.75.75 0 00-.75-.75h-4A3.417 3.417 0 008 2.53a3.418 3.418 0 00-2.667-1.28h-4zm7.417 10.3a2.75 2.75 0 011.25-.3h3.917v-8.5h-3.25A1.917 1.917 0 008.75 4.667v6.883zm-1.5 0V4.667A1.917 1.917 0 005.333 2.75h-3.25v8.5H6c.439 0 .866.105 1.25.3z"
    >
      {" "}
    </path>
  </svg>
);

export default Book;
