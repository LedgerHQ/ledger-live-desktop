// @flow

import { rgba } from './helpers'

export const space = [0, 5, 10, 15, 20, 30, 40, 50, 70]
export const fontSizes = [8, 9, 10, 12, 13, 16, 18, 22, 32]
export const radii = [0, 4]
export const shadows = ['0 4px 8px 0 rgba(0, 0, 0, 0.03)']

export const fontFamilies = {
  Inter: {
    ExtraLight: {
      weight: 100,
      style: 'normal',
    },
    Light: {
      weight: 300,
      style: 'normal',
    },
    Regular: {
      weight: 400,
      style: 'normal',
    },
    Medium: {
      weight: 500,
      style: 'normal',
    },
    SemiBold: {
      weight: 600,
      style: 'normal',
    },
    Bold: {
      weight: 700,
      style: 'normal',
    },
    ExtraBold: {
      weight: 800,
      style: 'normal',
    },
  },
}

export const colors = {
  transparent: 'transparent',

  pearl: '#ff0000',

  // new colors
  alertRed: '#ea2e49',
  warning: '#f57f17',
  black: '#000000',
  dark: '#142533',
  separator: '#aaaaaa',
  fog: '#d8d8d8',
  graphite: '#767676',
  grey: '#999999',
  identity: '#41ccb4',
  lightFog: '#eeeeee',
  sliderGrey: '#F0EFF1',
  lightGraphite: '#fafafa',
  lightGrey: '#f9f9f9',
  starYellow: '#FFD24A',
  orange: '#ffa726',
  positiveGreen: '#66be54',
  smoke: '#666666',
  wallet: '#6490f1',
  pillActiveBackground: rgba('#6490f1', 0.1),
  lightRed: rgba('#ea2e49', 0.1),
  white: '#ffffff',
  experimentalBlue: '#165edb',

  // market indicator
  marketUp_eastern: '#ea2e49',
  marketUp_western: '#66be54',
  marketDown_eastern: '#6490f1',
  marketDown_western: '#ea2e49',
}

export default {
  sizes: {
    topBarHeight: 58,
    sideBarWidth: 230,
  },
  radii,
  fontFamilies,
  fontSizes,
  space,
  shadows,
  colors,
}
