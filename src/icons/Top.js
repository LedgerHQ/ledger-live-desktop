// @flow

import React from 'react'

const path = (
  <path
    fill="currentColor"
    d="M4.502 11h6.996c1.333 0 2.005-1.617 1.06-2.56l-3.497-3.5a1.5 1.5 0 0 0-2.122 0l-3.498 3.5C2.499 9.381 3.166 11 4.5 11z"
  />
)

export default ({ size, ...p }: { size: number }) => (
  <svg viewBox="0 0 16 16" height={size} width={size} {...p}>
    {path}
  </svg>
)
