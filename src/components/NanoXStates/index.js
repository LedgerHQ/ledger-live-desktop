// @flow
import React from 'react'

import Box from 'components/base/Box'

type SVGProps = {
  style?: *,
}

const ConfirmSVG = ({ style }: SVGProps) => (
  <svg style={style} width="374" height="42" viewBox="0 0 374 42">
    <defs>
      <path
        id="a"
        d="M13.62 2.608l-8.22 8.22-3.02-3.02a.375.375 0 0 0-.53 0l-.884.884a.375.375 0 0 0 0 .53l4.169 4.17a.375.375 0 0 0 .53 0l9.37-9.37a.375.375 0 0 0 0-.53l-.884-.884a.375.375 0 0 0-.53 0z"
      />
      <linearGradient id="c" x1="50%" x2="50%" y1="98.633%" y2="0%">
        <stop offset="0%" stopColor="#FFF" />
        <stop offset="100%" stopColor="#142533" />
      </linearGradient>
    </defs>
    <g fill="none" fillRule="evenodd">
      <g transform="translate(100)">
        <rect
          width="271.606"
          height="39.606"
          x="1.197"
          y="1.197"
          fill="#6490F1"
          fillOpacity=".12"
          stroke="#142533"
          strokeWidth="2.394"
          rx="6.227"
        />
        <path
          fill="#FFF"
          stroke="#142533"
          strokeWidth="2.394"
          d="M135 1.197c-10.937 0-19.803 8.866-19.803 19.803 0 10.937 8.866 19.803 19.803 19.803h135A2.803 2.803 0 0 0 272.803 38V4A2.803 2.803 0 0 0 270 1.197H135z"
        />
        <circle cx="135" cy="21" r="10.5" stroke="#142533" strokeLinejoin="square" />
        <circle cx="135" cy="21" r="11.5" stroke="#D8D8D8" />
        <g>
          <circle cx="25" cy="21" r="10.5" stroke="#142533" strokeLinejoin="square" />
          <circle cx="25" cy="21" r="11.5" stroke="#6490F1" strokeOpacity=".2" />
        </g>
      </g>
      <g transform="translate(142 6)">
        <rect
          width="65"
          height="29"
          x=".5"
          y=".5"
          fill="#FFF"
          fillOpacity=".8"
          stroke="#6490F1"
          strokeOpacity=".2"
          rx="2"
        />
        <g transform="translate(25 7)">
          <mask id="b" fill="#fff">
            <use xlinkHref="#a" />
          </mask>
          <use fill="#142533" xlinkHref="#a" />
          <g fill="#66BE54" mask="url(#b)">
            <path d="M0 0h16v16H0z" />
          </g>
        </g>
      </g>
      <g strokeWidth="2">
        <path
          stroke="url(#c)"
          d="M10 53h.778L10 52.222V52l-.111.111L9.778 52v.222L9 53h.778v48H9l.778.778V102l.11-.111L10 102v-.222l.778-.778H10V53zm6.222 0H17l-.778-.778V52l-.11.111L16 52v.222l-.778.778H16v48h-.778l.778.778V102l.111-.111.111.111v-.222L17 101h-.778V53z"
          transform="matrix(0 -1 -1 0 102 34)"
        />
        <path
          stroke="#142533"
          d="M63 26H49.2a.2.2 0 0 1-.2-.2v-9.6c0-.11.09-.2.2-.2H63v10zM101 31.6a1.4 1.4 0 0 1-1.4 1.4H69.2a6.2 6.2 0 0 1-6.2-6.2V15.2A6.2 6.2 0 0 1 69.2 9h30.4a1.4 1.4 0 0 1 1.4 1.4v21.2z"
        />
      </g>
    </g>
  </svg>
)

const RejectedSVG = ({ style }: SVGProps) => (
  <svg style={style} width="286" height="54" viewBox="0 0 286 54">
    <defs>
      <path
        id="a"
        d="M9.372 8l4.506-4.506a.416.416 0 0 0 0-.59l-.783-.782a.416.416 0 0 0-.589 0L8 6.628 3.494 2.122a.416.416 0 0 0-.59 0l-.782.783a.416.416 0 0 0 0 .589L6.628 8l-4.506 4.506a.416.416 0 0 0 0 .59l.783.782a.416.416 0 0 0 .589 0L8 9.372l4.506 4.506a.416.416 0 0 0 .59 0l.782-.783a.416.416 0 0 0 0-.589L9.372 8z"
      />
      <path id="c" d="M16 28c6.627 0 12-5.373 12-12S22.627 4 16 4 4 9.373 4 16s5.373 12 12 12z" />
      <path
        id="e"
        d="M7.029 6l3.38-3.38a.312.312 0 0 0 0-.441l-.588-.587a.312.312 0 0 0-.441 0L6 4.972l-3.38-3.38a.312.312 0 0 0-.441 0l-.587.587a.312.312 0 0 0 0 .441L4.972 6l-3.38 3.38a.312.312 0 0 0 0 .441l.587.587c.122.123.32.123.441 0L6 7.028l3.38 3.38c.122.123.32.123.441 0l.587-.587a.312.312 0 0 0 0-.441L7.028 6z"
      />
    </defs>
    <g fill="none" fillRule="evenodd">
      <g transform="translate(0 12)">
        <rect
          width="271.606"
          height="39.606"
          x="1.197"
          y="1.197"
          fill="#EA2E49"
          fillOpacity=".12"
          stroke="#142533"
          strokeWidth="2.394"
          rx="6.227"
        />
        <path
          fill="#FFF"
          stroke="#142533"
          strokeWidth="2.394"
          d="M135 1.197c-10.937 0-19.803 8.866-19.803 19.803 0 10.937 8.866 19.803 19.803 19.803h135A2.803 2.803 0 0 0 272.803 38V4A2.803 2.803 0 0 0 270 1.197H135z"
        />
        <circle cx="135" cy="21" r="10.5" stroke="#142533" strokeLinejoin="square" />
        <circle cx="135" cy="21" r="11.5" stroke="#D8D8D8" />
        <g>
          <circle cx="25" cy="21" r="10.5" stroke="#142533" strokeLinejoin="square" />
          <circle cx="25" cy="21" r="11.5" stroke="#EA2E49" strokeOpacity=".2" />
        </g>
      </g>
      <g transform="translate(42 18)">
        <rect
          width="65"
          height="29"
          x=".5"
          y=".5"
          fill="#FFF"
          fillOpacity=".8"
          stroke="#EA2E49"
          strokeOpacity=".2"
          rx="2"
        />
        <g transform="translate(25 7)">
          <mask id="b" fill="#fff">
            <use xlinkHref="#a" />
          </mask>
          <g fill="#EA2E49" mask="url(#b)">
            <path d="M0 0h16v16H0z" />
          </g>
        </g>
      </g>
      <g transform="translate(254)">
        <path
          fill="#FFF"
          fillRule="nonzero"
          d="M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16-7.163 16-16 16z"
        />
        <mask id="d" fill="#fff">
          <use xlinkHref="#c" />
        </mask>
        <use fill="#FFF" fillRule="nonzero" xlinkHref="#c" />
        <g fill="#EA2E49" mask="url(#d)">
          <path d="M0 0h32v32H0z" />
        </g>
      </g>
      <g transform="translate(264 10)">
        <mask id="f" fill="#fff">
          <use xlinkHref="#e" />
        </mask>
        <g fill="#FFF" mask="url(#f)">
          <path d="M0 0h11.5v11.5H0z" />
        </g>
      </g>
    </g>
  </svg>
)

const ValidateSVG = ({ style }: SVGProps) => (
  <svg style={style} width="374" height="87" viewBox="0 0 374 87">
    <defs>
      <linearGradient id="a" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop offset="0%" stopColor="#4F87FF" stopOpacity="0" />
        <stop offset="100%" stopColor="#4B84FF" />
      </linearGradient>
      <path
        id="b"
        d="M13.62 2.608l-8.22 8.22-3.02-3.02a.375.375 0 0 0-.53 0l-.884.884a.375.375 0 0 0 0 .53l4.169 4.17a.375.375 0 0 0 .53 0l9.37-9.37a.375.375 0 0 0 0-.53l-.884-.884a.375.375 0 0 0-.53 0z"
      />
      <linearGradient id="d" x1="50%" x2="50%" y1="98.633%" y2="0%">
        <stop offset="0%" stopColor="#FFF" />
        <stop offset="100%" stopColor="#142533" />
      </linearGradient>
    </defs>
    <g fill="none" fillRule="evenodd">
      <g transform="translate(100 45)">
        <rect
          width="271.606"
          height="39.606"
          x="1.197"
          y="1.197"
          fill="#6490F1"
          fillOpacity=".12"
          stroke="#142533"
          strokeWidth="2.394"
          rx="6.227"
        />
        <path
          fill="#FFF"
          stroke="#142533"
          strokeWidth="2.394"
          d="M135 1.197c-10.937 0-19.803 8.866-19.803 19.803 0 10.937 8.866 19.803 19.803 19.803h135A2.803 2.803 0 0 0 272.803 38V4A2.803 2.803 0 0 0 270 1.197H135z"
        />
        <circle cx="135" cy="21" r="10.5" stroke="#142533" strokeLinejoin="square" />
        <circle cx="135" cy="21" r="11.5" stroke="#D8D8D8" />
        <g>
          <circle cx="25" cy="21" r="10.5" stroke="#142533" strokeLinejoin="square" />
          <circle cx="25" cy="21" r="11.5" stroke="#6490F1" strokeOpacity=".2" />
        </g>
      </g>
      <g transform="translate(120)">
        <circle
          cx="5"
          cy="66"
          r="5.265"
          fill="#4B84FF"
          fillOpacity=".2"
          stroke="#4B84FF"
          strokeOpacity=".6"
          strokeWidth=".531"
        />
        <circle cx="5" cy="66" r="2" fill="#4B84FF" stroke="#4B84FF" strokeWidth=".8" />
        <path fill="url(#a)" fillRule="nonzero" d="M5.5 64h-1V0h1z" />
      </g>
      <g transform="translate(230)">
        <circle
          cx="5"
          cy="66"
          r="5.265"
          fill="#4B84FF"
          fillOpacity=".2"
          stroke="#4B84FF"
          strokeOpacity=".6"
          strokeWidth=".531"
        />
        <circle cx="5" cy="66" r="2" fill="#4B84FF" stroke="#4B84FF" strokeWidth=".8" />
        <path fill="url(#a)" fillRule="nonzero" d="M5.5 64h-1V0h1z" />
      </g>
      <g transform="translate(142 51)">
        <rect
          width="65"
          height="29"
          x=".5"
          y=".5"
          fill="#FFF"
          fillOpacity=".8"
          stroke="#6490F1"
          strokeOpacity=".2"
          rx="2"
        />
        <g transform="translate(25 7)">
          <mask id="c" fill="#fff">
            <use xlinkHref="#b" />
          </mask>
          <use fill="#142533" xlinkHref="#b" />
          <g fill="#66BE54" mask="url(#c)">
            <path d="M0 0h16v16H0z" />
          </g>
        </g>
      </g>
      <g strokeWidth="2">
        <path
          stroke="url(#d)"
          d="M10 53h.778L10 52.222V52l-.111.111L9.778 52v.222L9 53h.778v48H9l.778.778V102l.11-.111L10 102v-.222l.778-.778H10V53zm6.222 0H17l-.778-.778V52l-.11.111L16 52v.222l-.778.778H16v48h-.778l.778.778V102l.111-.111.111.111v-.222L17 101h-.778V53z"
          transform="matrix(0 -1 -1 0 102 79)"
        />
        <path
          stroke="#142533"
          d="M63 71H49.2a.2.2 0 0 1-.2-.2v-9.6c0-.11.09-.2.2-.2H63v10zM101 76.6a1.4 1.4 0 0 1-1.4 1.4H69.2a6.2 6.2 0 0 1-6.2-6.2V60.2a6.2 6.2 0 0 1 6.2-6.2h30.4a1.4 1.4 0 0 1 1.4 1.4v21.2z"
        />
      </g>
    </g>
  </svg>
)

const ErrorSVG = ({ style }: SVGProps) => (
  <svg style={style} width="274" height="42" viewBox="0 0 274 42">
    <g fill="none" fillRule="evenodd">
      <rect
        width="271.606"
        height="39.606"
        x="1.197"
        y="1.197"
        fill="#EA2E49"
        fillOpacity=".12"
        stroke="#142533"
        strokeWidth="2.394"
        rx="6.227"
      />
      <path
        fill="#FFF"
        stroke="#142533"
        strokeWidth="2.394"
        d="M135 1.197c-10.937 0-19.803 8.866-19.803 19.803 0 10.937 8.866 19.803 19.803 19.803h135A2.803 2.803 0 0 0 272.803 38V4A2.803 2.803 0 0 0 270 1.197H135z"
      />
      <circle cx="135" cy="21" r="10.5" stroke="#142533" strokeLinejoin="square" />
      <circle cx="135" cy="21" r="11.5" stroke="#D8D8D8" />
      <g>
        <circle cx="25" cy="21" r="10.5" stroke="#142533" strokeLinejoin="square" />
        <circle cx="25" cy="21" r="11.5" stroke="#EA2E49" strokeOpacity=".2" />
      </g>
    </g>
  </svg>
)

type Props = {
  error?: boolean,
  rejected?: boolean,
  validate?: boolean,
  style?: *,
}

const NanoXStates = ({ error = false, validate = false, rejected = false, style }: Props) => {
  const SVG = error ? ErrorSVG : rejected ? RejectedSVG : validate ? ValidateSVG : ConfirmSVG

  return (
    <Box>
      <SVG style={[{ width: '100%', maxWidth: '100%' }, style]} />
    </Box>
  )
}

export default NanoXStates
