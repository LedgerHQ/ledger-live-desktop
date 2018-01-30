// @flow

/* eslint-disable no-unused-expressions */

import { injectGlobal } from 'styled-components'
import '@fortawesome/fontawesome-free-solid'
import '@fortawesome/fontawesome-free-regular'

injectGlobal`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font: inherit;
    color: inherit;
    user-select: none;
    cursor: inherit;
    min-width: 0;

    // it will surely make problem in the future... to be inspected.
    flex-shrink: 0;
  }

  html {
    -ms-overflow-style: -ms-autohiding-scrollbar;
  }

  body {
    line-height: 1.5;
    font-size: 16px;
    font-family: "Open Sans", Arial, Helvetica, sans-serif;
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

  .scrollbar-thumb-y {
    width: 5px !important;
  }
  .scrollbar-thumb-x {
    height: 5px !important;
  }
  .scrollbar-track {
    background: transparent !important;
    transition: opacity 0.2s ease-in-out !important;
  }
  .scrollbar-track-y {
    right: 2px !important;
    width: 5px !important;
  }
  .scrollbar-track-x {
    bottom: 2px !important;
    height: 5px !important;
  }
`
