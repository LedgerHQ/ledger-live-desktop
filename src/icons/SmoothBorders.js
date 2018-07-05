// @flow

import React from 'react'

const inner = (
  <path
    d="m8.75 0.75h12c4.432 0 8 3.568 8 8v12c0 4.432-3.568 8-8 8h-12c-4.432 0-8-3.568-8-8v-12c0-4.432 3.568-8 8-8z"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  />
)

export default ({ size, ...p }: { size: number }) => (
  <svg viewBox="0 0 29.5 29.5" height={size} width={size} {...p}>
    {inner}
  </svg>
)
