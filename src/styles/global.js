// @flow

/* eslint-disable no-unused-expressions */

import { injectGlobal } from 'styled-components'
import omitBy from 'lodash/omitBy'

import { fontFace, rgba } from 'styles/helpers'
import { radii, colors } from 'styles/theme'
import reset from './reset'

const { STORYBOOK_ENV, NODE_ENV } = process.env
const COPYRIGHTED_FONTS = ['Museo Sans']

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
  Rubik: [
    {
      style: 'normal',
      weight: 500,
      file: 'rubik/Rubik-Regular',
    },
  ],
}

function transformFonts(allFonts) {
  allFonts = omitBy(
    allFonts,
    (_, key: string) =>
      NODE_ENV === 'production' && STORYBOOK_ENV && COPYRIGHTED_FONTS.includes(key),
  )
  return Object.keys(allFonts)
    .map(name => {
      const fonts = allFonts[name]
      return fonts.map(f => fontFace({ name, ...f })).join('\n')
    })
    .join('\n')
}

injectGlobal`
  ${transformFonts(fonts)};
  ${reset};

  .tippy-tooltip {
    background-color: ${colors.dark};
    border-radius: ${radii[1]}px;
  }

  .tippy-popper .tippy-roundarrow {
    fill: ${colors.dark};
  }

  .select__control:hover, .select__control-is-focused {
    border-color: ${colors.fog};
  }

  .select__single-value {
    color: inherit !important;
    right: 0;
    left: 15px;
  }

  .select__placeholder {
    color ${colors.fog} !important;
  }

  .select__option:active {
    background: ${colors.lightGrey} !important;
  }

  ::selection {
    background: ${rgba(colors.wallet, 0.1)};
  }
`
