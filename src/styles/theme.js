// @flow

export const space = [0, 5, 10, 15, 20, 30, 40, 50, 70]
export const fontSizes = [8, 9, 10, 12, 13, 16, 18, 22, 32]
export const radii = [0, 4]
export const shadows = ['0 4px 8px 0 rgba(0, 0, 0, 0.03)']

export const fontFamilies = {
  'Open Sans': {
    Light: {
      weight: 300,
      style: 'normal',
    },
    Regular: {
      weight: 400,
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

  'Museo Sans': {
    ExtraLight: {
      weight: 100,
      style: 'normal',
    },
    Light: {
      weight: 300,
      style: 'normal',
    },
    Regular: {
      weight: 500,
      style: 'normal',
    },
    Bold: {
      weight: 700,
      style: 'normal',
    },
    ExtraBold: {
      weight: 900,
      style: 'normal',
    },
  },

  Rubik: {
    Regular: {
      weight: 500,
      style: 'normal',
    },
  },
}

export const colors = {
  transparent: 'transparent',

  pearl: '#ff0000',

  // new colors
  alertRed: '#ea2e49',
  black: '#000000',
  dark: '#142533',
  fog: '#d8d8d8',
  graphite: '#767676',
  grey: '#999999',
  identity: '#41ccb4',
  lightFog: '#eeeeee',
  lightGraphite: '#fafafa',
  lightGrey: '#f9f9f9',
  positiveGreen: '#66be54',
  smoke: '#666666',
  wallet: '#6490f1',
  white: '#ffffff',
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
