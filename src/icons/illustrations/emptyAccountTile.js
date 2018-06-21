// @flow

import React from 'react'

export default () => (
  <svg width="224" height="94">
    <defs>
      <rect id="b" x="20" y="12" width="142" height="40" rx="4" />
      <filter
        x="-28.9%"
        y="-55%"
        width="157.7%"
        height="305%"
        filterUnits="objectBoundingBox"
        id="a"
      >
        <feOffset dy="19" in="SourceAlpha" result="shadowOffsetOuter1" />
        <feGaussianBlur stdDeviation="10.5" in="shadowOffsetOuter1" result="shadowBlurOuter1" />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0" in="shadowBlurOuter1" />
      </filter>
      <rect id="d" x="10" y="9" width="162" height="38" rx="4" />
      <filter
        x="-25.3%"
        y="-57.9%"
        width="150.6%"
        height="315.8%"
        filterUnits="objectBoundingBox"
        id="c"
      >
        <feOffset dy="19" in="SourceAlpha" result="shadowOffsetOuter1" />
        <feGaussianBlur stdDeviation="10.5" in="shadowOffsetOuter1" result="shadowBlurOuter1" />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0" in="shadowBlurOuter1" />
      </filter>
      <rect id="f" width="182" height="42" rx="4" />
      <filter
        x="-22.5%"
        y="-52.4%"
        width="145.1%"
        height="295.2%"
        filterUnits="objectBoundingBox"
        id="e"
      >
        <feOffset dy="19" in="SourceAlpha" result="shadowOffsetOuter1" />
        <feGaussianBlur stdDeviation="10.5" in="shadowOffsetOuter1" result="shadowBlurOuter1" />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0" in="shadowBlurOuter1" />
      </filter>
      <path
        d="M5.62 0h1.7v3.058h-1.7V0zm1.7 0v3.058h-1.7V0h1.7zM5.813 12.942h1.7V16h-1.7v-3.058zm1.7 0V16h-1.7v-3.058h1.7zM2.406 0h1.7v3.058h-1.7V0zm1.7 0v3.058h-1.7V0h1.7zM2.6 12.942h1.7V16H2.6v-3.058zm1.7 0V16H2.6v-3.058h1.7zM.666 8.813V1.95h.85l6.139.002c1.807.11 3.212 1.566 3.118 3.254l-.002.279c.111 1.744-1.298 3.217-3.168 3.328H.666zm.85 0l.85-.85v4.32h5.608c.95-.025 1.676-.727 1.659-1.557v-.37c.019-.814-.707-1.518-1.637-1.543h-6.48zm7.557-3.275l.001-.378c.042-.77-.62-1.457-1.471-1.51H2.366v3.463h5.205c.899-.063 1.552-.753 1.502-1.575zM2.366 7.113l5.186.002.467-.002c1.86.05 3.355 1.5 3.314 3.262v.334c.036 1.779-1.458 3.224-3.337 3.273H.666V7.113h1.7zm0 0v.85l-.85-.85h.85z"
        id="g"
      />
    </defs>
    <g fill="none" fill-rule="evenodd">
      <g transform="translate(21 2)">
        <use fill="#000" filter="url(#a)" xlinkHref="#b" />
        <use fill="#FFF" xlinkHref="#b" />
      </g>
      <g transform="translate(21 2)">
        <use fill="#000" filter="url(#c)" xlinkHref="#d" />
        <use fill="#FFF" xlinkHref="#d" />
      </g>
      <g transform="translate(21 2)">
        <use fill="#000" filter="url(#e)" xlinkHref="#f" />
        <use fill="#FFF" xlinkHref="#f" />
        <rect fill="#999" x="39" y="13" width="120" height="5" rx="2.5" />
        <rect fill="#D8D8D8" x="39" y="23" width="70" height="5" rx="2.5" />
        <g transform="translate(17 13)">
          <use fill="#FCB653" fill-rule="nonzero" xlinkHref="#g" />
        </g>
      </g>
    </g>
  </svg>
)
