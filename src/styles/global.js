// @flow

/* eslint-disable no-unused-expressions */

import { injectGlobal } from 'styled-components'

import '@fortawesome/fontawesome-free-solid'
import '@fortawesome/fontawesome-free-regular'
import '@fortawesome/fontawesome-free-brands'

injectGlobal`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font: inherit;
    color: inherit;
    user-select: none;
    min-width: 0;

    // it will surely make problem in the future... to be inspected.
    flex-shrink: 0;
  }

  body {
    cursor: default;
    font-family: "Open Sans", Arial, Helvetica, sans-serif;
    font-size: 16px;
    line-height: 1.5;
  }

  #app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  b {
    font-weight: bold;
  }

  em {
    font-style: italic;
  }

  .scrollbar-thumb {
    background: rgb(102, 102, 102) !important;
    padding: 2px;
    background-clip: content-box !important;
  }
  .scrollbar-track {
    background: transparent !important;
    transition: opacity 0.2s ease-in-out !important;
    z-index: 20 !important;
  }

  .recharts-wrapper {
    cursor: inherit !important;
  }
`
