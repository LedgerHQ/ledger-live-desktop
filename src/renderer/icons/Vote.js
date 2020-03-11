// @flow

import React from "react";

const Vote = ({ size }: { size: number }) => (
  <svg viewBox="0 0 16 16" height={size} width={size}>
    <path
      d="M5.91699 8.36389L7.30542 9.75232L10.0823 6.97546"
      stroke="currentColor"
      strokeOpacity="0.5"
      strokeWidth="1.5"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.4541 0.000244141V16.0002H2.18137H2.9541H13.045L13.8177 16.0002L14.545 16.0002V5.09115L13.045 3.59115L10.9541 1.50024L9.4541 0.000244141H2.9541H2.18137H1.4541ZM9.4541 1.50024H2.9541V14.5002L13.045 14.5002V5.09115H12.4237H10.9541H9.4541V3.59115V2.12156V1.50024Z"
      fill="currentColor"
      fillOpacity="0.4"
    />
  </svg>
);

export default Vote;
