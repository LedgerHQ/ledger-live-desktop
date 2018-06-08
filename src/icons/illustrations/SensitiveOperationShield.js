// @flow

import React from 'react'

export default () => (
  <svg width="26" height="31">
    <defs>
      <path id="a" d="M4 0h600a4 4 0 0 1 4 4v112a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z" />
      <mask id="b" width="608" height="120" x="0" y="0" fill="#fff">
        <use xlinkHref="#a" />
      </mask>
      <filter
        id="c"
        width="153.8%"
        height="141.9%"
        x="-26.9%"
        y="-19.4%"
        filterUnits="objectBoundingBox"
      >
        <feOffset dy="1" in="SourceAlpha" result="shadowOffsetOuter1" />
        <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="1.5" />
        <feColorMatrix
          in="shadowBlurOuter1"
          result="shadowMatrixOuter1"
          values="0 0 0 0 0.418261054 0 0 0 0 0.418261054 0 0 0 0 0.418261054 0 0 0 0.116196784 0"
        />
        <feMerge>
          <feMergeNode in="shadowMatrixOuter1" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <path id="d" d="M13 30s13-4.426 13-14.016V4.795L13 0 0 4.795v11.189C0 25.574 13 30 13 30z" />
    </defs>
    <g fill="none" fillRule="evenodd" transform="translate(-567 -15)">
      <use
        fill="#F9F9F9"
        fillOpacity=".5"
        stroke="#D8D8D8"
        strokeDasharray="3"
        strokeWidth="2"
        mask="url(#b)"
        xlinkHref="#a"
      />
      <g filter="url(#c)" transform="translate(567 15)">
        <g strokeLinecap="round" strokeLinejoin="round">
          <use fill="#FFF" stroke="#EA2E49" strokeWidth="1.5" xlinkHref="#d" />
          <path
            stroke="#FFF"
            strokeWidth="2"
            d="M12.678 30.947c-.116-.04-.321-.115-.603-.225-.462-.182-.975-.4-1.527-.656a29.353 29.353 0 0 1-4.627-2.662C1.621 24.354-1 20.56-1 15.984V4.098l14-5.164 14 5.164v11.886c0 4.577-2.62 8.37-6.921 11.42a29.353 29.353 0 0 1-4.627 2.662c-.552.256-1.065.474-1.527.656-.282.11-.487.185-.603.225l-.322.11-.322-.11z"
          />
        </g>
        <path
          fill="#EA2E49"
          fillRule="nonzero"
          d="M17.129 10.305c-.419 0-.76.35-.76.783l-.013 3.51s.001.246-.227.246c-.234 0-.227-.245-.227-.245V9.534a.755.755 0 0 0-.756-.768c-.42 0-.718.336-.718.768v5.064s-.026.248-.251.248c-.224 0-.24-.248-.24-.248V8.69c0-.432-.316-.76-.736-.76s-.738.328-.738.76v5.908s-.011.237-.253.237c-.237 0-.238-.237-.238-.237V10.21c0-.432-.328-.703-.747-.703-.42 0-.727.27-.727.703v6.415s-.04.285-.437-.186c-1.017-1.206-1.548-1.446-1.548-1.446s-.965-.488-1.393.392c-.31.639.019.673.525 1.457.448.694 1.866 2.52 1.866 2.52s1.68 2.444 3.95 2.444c0 0 4.442.196 4.442-4.336l-.015-6.381a.771.771 0 0 0-.76-.783"
        />
      </g>
    </g>
  </svg>
)
