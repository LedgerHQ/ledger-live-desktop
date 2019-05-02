// @flow

import React from 'react'

export default ({ size, color = 'currentColor', ...p }: { size: number, color?: string }) => (
  <svg viewBox="0 0 16 16" height={size} width={size} {...p}>
    <path
      fill={color}
      d="M13.62 2.608l-8.22 8.22-3.02-3.02a.375.375 0 0 0-.53 0l-.884.884a.375.375 0 0 0 0 .53l4.169 4.17a.375.375 0 0 0 .53 0l9.37-9.37a.375.375 0 0 0 0-.53l-.884-.884a.375.375 0 0 0-.53 0z"
    />
  </svg>
)
