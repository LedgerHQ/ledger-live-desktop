// @flow

import React, { Fragment } from 'react'

const path = (
  <Fragment>
    <path
      fill="currentColor"
      d="m9.9609 0a1.0001 1.0001 0 0 0-0.57422 0.21094l-9 7a1.0001 1.0001 0 0 0-0.38672 0.78906v11c0 1.645 1.355 3 3 3h14c1.645 0 3-1.355 3-3v-11a1.0001 1.0001 0 0 0-0.38672-0.78906l-9-7a1.0001 1.0001 0 0 0-0.65234-0.21094zm0.039062 2.2676 8 6.2207v10.512c0 0.56413-0.43587 1-1 1h-14c-0.56413 0-1-0.43587-1-1v-10.512z"
    />
    <path
      fill="currentColor"
      d="m7 10a1.0001 1.0001 0 0 0-1 1v10a1.0001 1.0001 0 1 0 2 0v-9h4v9a1.0001 1.0001 0 1 0 2 0v-10a1.0001 1.0001 0 0 0-1-1z"
    />
  </Fragment>
)

export default ({ size, ...p }: { size: number }) => (
  <svg viewBox="0 0 20 22.014" height={size} width={size} {...p}>
    {path}
  </svg>
)
