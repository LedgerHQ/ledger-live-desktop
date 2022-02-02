// @flow

import React from "react";

const path = (
  <>
    <path d="M12.5834 8.66667H9.66669V10.1667H12.5834V8.66667Z" fill="currentColor" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.03347 0.75C0.57323 0.75 0.200134 1.1231 0.200134 1.58333V12.4167C0.200134 12.8769 0.573231 13.25 1.03347 13.25H14.9668C15.427 13.25 15.8001 12.8769 15.8001 12.4167V1.58333C15.8001 1.1231 15.427 0.75 14.9668 0.75H1.03347ZM1.70013 2.25V4.5H14.3001V2.25H1.70013ZM1.70013 11.75V6H14.3001V11.75H1.70013Z"
      fill="currentColor"
    />
  </>
);

const Card = ({ size }: { size: number }) => (
  <svg viewBox="0 0 16 16" height={size} width={size}>
    {path}
  </svg>
);

export default Card;
