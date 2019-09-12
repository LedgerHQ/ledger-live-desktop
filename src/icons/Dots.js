// @flow

import React from 'react'

export default ({ size, color = 'currentColor', ...p }: { size: number, color?: string }) => (
  <svg viewBox="0 0 18 4" height={size} width={size} {...p}>
    <path
      d="M9 3a1 1 0 110-2 1 1 0 010 2zm7 0a1 1 0 110-2 1 1 0 010 2zM2 3a1 1 0 110-2 1 1 0 010 2z"
      stroke={color}
      strokeWidth="2"
      fill={color}
      fillRule="evenodd"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
