// @flow

/* this icon is a placeholder for now */

import React from 'react'

const defs = (
  <defs>
    <filter
      id="a"
      width="178.9%"
      height="178.9%"
      x="-39.4%"
      y="-37.2%"
      filterUnits="objectBoundingBox"
    >
      <feOffset dy="2" in="SourceAlpha" result="shadowOffsetOuter1" />
      <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="11.5" />
      <feColorMatrix
        in="shadowBlurOuter1"
        result="shadowMatrixOuter1"
        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.0787760417 0"
      />
      <feMerge>
        <feMergeNode in="shadowMatrixOuter1" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
)

const group = (
  <g fill="none" fillRule="evenodd" filter="url(#a)" transform="translate(23 21)">
    <rect width="90" height="90" fill="#FFF" rx="20" />
    <path fill="#6490F1" d="M45 13.36c-17.475 0-31.64 14.165-31.64 31.64S27.524 76.64 45 76.64" />
    <path fill="#142533" fillOpacity=".1" d="M13.36 45c0 17.475 14.165 31.64 31.64 31.64V45" />
    <path
      fill="#142533"
      fillOpacity=".1"
      d="M22.845 67.59c5.708 5.598 13.528 9.05 22.155 9.05V45"
    />
  </g>
)

export default ({ size, ...p }: { size: number }) => (
  <svg width={size} height={size} {...p}>
    {defs}
    {group}
  </svg>
)
