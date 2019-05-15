// @flow

import React from 'react'

const Swap = ({
  size = 15,
  color = 'currentColor',
  ...props
}: {
  size?: number,
  color?: string,
}) => (
  <svg viewBox="0 0 15 17" width={(size / 15) * 15} height={(size / 15) * 17} {...props}>
    <path
      fill="none"
      fillRule="evenodd"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M5.5 1.5v14.4V1.5zm0 0L1.61 5.39 5.5 1.5zm4 14.4V1.5v14.4zm0 0l4-4-4 4z"
    />
  </svg>
)

export default Swap
