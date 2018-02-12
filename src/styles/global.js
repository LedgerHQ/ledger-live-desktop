// @flow

/* eslint-disable no-unused-expressions */

import { injectGlobal } from 'styled-components'

import '@fortawesome/fontawesome-free-solid'
import '@fortawesome/fontawesome-free-regular'
import '@fortawesome/fontawesome-free-brands'

import { fontFace } from 'styles/helpers'

const fonts = {
  'Open Sans': [
    {
      style: 'normal',
      weight: 700,
      file: 'opensans/OpenSans-Bold',
    },
    {
      style: 'normal',
      weight: 800,
      file: 'opensans/OpenSans-ExtraBold',
    },
    {
      style: 'normal',
      weight: 300,
      file: 'opensans/OpenSans-Light',
    },
    {
      style: 'normal',
      weight: 400,
      file: 'opensans/OpenSans-Regular',
    },
    {
      style: 'normal',
      weight: 600,
      file: 'opensans/OpenSans-SemiBold',
    },
  ],
  'Museo Sans': [
    {
      style: 'normal',
      weight: 100,
      file: 'museosans/MuseoSans-ExtraLight',
    },
    {
      style: 'normal',
      weight: 300,
      file: 'museosans/MuseoSans-Light',
    },
    {
      style: 'normal',
      weight: 500,
      file: 'museosans/MuseoSans-Regular',
    },
    {
      style: 'normal',
      weight: 700,
      file: 'museosans/MuseoSans-Bold',
    },
    {
      style: 'normal',
      weight: 900,
      file: 'museosans/MuseoSans-ExtraBold',
    },
  ],
}

function transformFonts(allFonts) {
  return Object.keys(allFonts)
    .map(name => {
      const fonts = allFonts[name]
      return fonts.map(f => fontFace({ name, ...f })).join('\n')
    })
    .join('\n')
}

injectGlobal`
  ${transformFonts(fonts)};

  * {
    -webkit-font-smoothing: antialiased;
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
    font-family: "Museo Sans", "Open Sans", Arial, Helvetica, sans-serif;
    font-size: 16px;
    font-weight: 300;
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

  .scroll-content {
    height: 100%;

    > div {
      height: 100%;
    }
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
