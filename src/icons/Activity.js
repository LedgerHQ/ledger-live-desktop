// @flow

import React from 'react'

const path = (
  <path
    fill="currentColor"
    d="M11.488 8.063a.75.75 0 0 1 .712-.513H15a.75.75 0 1 1 0 1.5h-2.26l-1.928 5.787c-.228.684-1.196.684-1.424 0L5.9 4.372 4.512 8.537a.75.75 0 0 1-.712.513H1a.75.75 0 0 1 0-1.5h2.26l1.928-5.787c.228-.684 1.196-.684 1.424 0L10.1 12.228l1.388-4.165z"
  />
)

export default ({ size, ...p }: { size: number }) => (
  <svg viewBox="0 0 16 16" height={size} width={size} {...p}>
    {path}
  </svg>
)
