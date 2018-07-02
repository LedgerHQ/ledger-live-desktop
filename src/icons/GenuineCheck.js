// @flow

import React, { Fragment } from 'react'

const path = (
  <Fragment>
    <rect
      x=".75"
      y=".75"
      width="24"
      height="24"
      rx="8"
      fill="none"
      fillRule="evenodd"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      transform="translate(4.75,4.75)"
      width="100%"
      height="100%"
      fill="#000000"
      d="m13.62 2.6083-8.2201 8.2201-3.0204-3.0204c-0.14644-0.14644-0.38388-0.14644-0.53034 0l-0.88388 0.88388c-0.14644 0.14644-0.14644 0.38388 0 0.53034l4.1694 4.1694c0.14644 0.14644 0.38388 0.14644 0.53034 0l9.3692-9.3692c0.14644-0.14644 0.14644-0.38387 0-0.53034l-0.88388-0.88388c-0.14644-0.14644-0.38388-0.14644-0.53031 0z"
    />
  </Fragment>
)

export default ({ size, ...p }: { size: number }) => (
  <svg viewBox="0 0 25.5 25.5" height={size} width={size} {...p}>
    {path}
  </svg>
)
