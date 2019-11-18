// @flow
import React from 'react'

const path = (
  <path
    fill="currentColor"
    d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm96 328c0 8.8-7.2 16-16 16H176c-8.8 0-16-7.2-16-16V176c0-8.8 7.2-16 16-16h160c8.8 0 16 7.2 16 16v160z"
  />
)

export default ({ size, ...p }: { size: number }) => (
  <svg viewBox="0 0 512 512" height={size} width={size} {...p}>
    {path}
  </svg>
)
