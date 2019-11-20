// @flow

import React from 'react'

export default ({ size = 30, ...p }: { size: number }) => (
  <svg viewBox="0 0 6 16" height={size} width={size} {...p}>
    <defs>
      <path
        id="NanoXBanner-a"
        d="M5.75 6.835a3.509 3.509 0 0 0-1.5-1.105V1.75h-2.5v3.98a3.509 3.509 0 0 0-1.5 1.105V1.666C.25.884.884.25 1.666.25h2.668c.782 0 1.416.634 1.416 1.416v5.169zm-1.5 7.415V9.5a1.25 1.25 0 1 0-2.5 0v4.75h2.5zM3 6.75A2.75 2.75 0 0 1 5.75 9.5v4.834c0 .782-.634 1.416-1.416 1.416H1.666A1.416 1.416 0 0 1 .25 14.334V9.5A2.75 2.75 0 0 1 3 6.75z"
      />
    </defs>
    <g fill="none" fillRule="evenodd">
      <path
        fill="#000"
        fillRule="nonzero"
        d="M5.75 6.835a3.509 3.509 0 0 0-1.5-1.105V1.75h-2.5v3.98a3.509 3.509 0 0 0-1.5 1.105V1.666C.25.884.884.25 1.666.25h2.668c.782 0 1.416.634 1.416 1.416v5.169zm-1.5 7.415V9.5a1.25 1.25 0 1 0-2.5 0v4.75h2.5zM3 6.75A2.75 2.75 0 0 1 5.75 9.5v4.834c0 .782-.634 1.416-1.416 1.416H1.666A1.416 1.416 0 0 1 .25 14.334V9.5A2.75 2.75 0 0 1 3 6.75z"
      />
      <g>
        <mask id="NanoXBanner-b" fill="#fff">
          <use xlinkHref="#NanoXBanner-a" />
        </mask>
        <use fill="#FFF" xlinkHref="#NanoXBanner-a" />
        <g fill="#FFF" mask="url(#NanoXBanner-b)">
          <path d="M-5 0h16v16H-5z" />
        </g>
      </g>
    </g>
  </svg>
)
