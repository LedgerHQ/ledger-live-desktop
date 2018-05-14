// @flow

import React from 'react'

const path = (
  <path
    fill="currentColor"
    d="M11.82 5H4.149c-1.46 0-2.2 1.616-1.161 2.56l3.834 3.5c.641.584 1.683.584 2.327 0l3.838-3.5c1.028-.941.298-2.56-1.165-2.56z"
  />
)

export default ({ size, ...p }: { size: number }) => (
  <svg viewBox="0 0 16 16" height={size} width={size} {...p}>
    {path}
  </svg>
)
