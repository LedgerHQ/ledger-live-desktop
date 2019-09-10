// @flow

import React from 'react'

const path = (
  <path
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    d="M7 17L17 7M7 7h10v10"
  />
)

export default ({ size, ...p }: { size: number }) => (
  <svg viewBox="0 0 24 24" height={size} width={size} {...p}>
    {path}
  </svg>
)
