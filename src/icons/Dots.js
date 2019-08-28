// @flow

import React from 'react'

const path = (
  <path
    d="M9 3a1 1 0 110-2 1 1 0 010 2zm7 0a1 1 0 110-2 1 1 0 010 2zM2 3a1 1 0 110-2 1 1 0 010 2z"
    stroke="currentColor"
    strokeWidth="2"
    fill="currentColor"
    fillRule="evenodd"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
)

export default ({ size, ...p }: { size: number }) => (
  <svg viewBox="0 0 18 4" height={size} width={size} {...p}>
    {path}
  </svg>
)
